import { Request, Response } from 'express';
import { PaymentController } from '../payment';
import csv = require('csvtojson');
import { Option } from '../models/option';

export class SWPSafeService extends PaymentController {

    protected options : Option =  {
        hostname : 'pass.hci.uni-konstanz.de',
        port: 443,
        path: '',                              // will be set up later
        method: 'GET',
        headers: undefined                     // swpsafe requests need no headers
    };

    protected async validateCountry(request: Request, response: Response): Promise<boolean> {
        // catch empty input 
        if (!request.body.swpCode) {
            response.status(400);
            response.send({code: 400, message: 'Bitte geben Sie einen SWP-Code ein' });
            return false;
        }

        // set up path
        const swpCode = encodeURIComponent(request.body.swpCode);
        this.options.path = `/swpsafe/country/code/${swpCode}`;

        // set up request
        const callback = async (r: Response, d: object): Promise<boolean> => {

            // Parse CSV
            const responseObject : {country: string, errorMessage: string}[] = await this.parseCSV(d.toString());
            
            if(!responseObject){
                r.send(502);
                r.send({code: 502, message: 'Es gab einen Fehler. Bitte melden Sie sich mit folgender Nachricht bei einem Administrator: C502, Fehler während Anfrage auf die Bezahlungs-API'});
                return false;
            }
            
            const responseMessage = responseObject[0];

            // Country was validated
            if (responseMessage.country !== '') {

                // Germany
                if (responseMessage.country === 'Deutschland') {
                    return true;
                }
                // Country isn't Germany
                else {
                    r.status(401);
                    r.send({ code: 401, message: 'Zahlung stammt nicht aus Deutschland'});
                    return false;
                }
            }

            // Country could not be validated
            else {
                r.status(502);
                r.send({
                    code: 502,
                    message: PaymentController.translateError(responseMessage.errorMessage)
                });
                return false;
            }


        };

        // make request
        return await this.paymentAPICall(this.options, '', response, callback); // empty string is supplied for data in swpsafe API calls

    }

    protected async validatePayment(request: Request, response: Response): Promise<boolean> {
        // catch empty input 
        if (!request.body.swpCode) {
            response.status(400);
            response.send({code: 400, message: 'Bitte geben Sie einen SWP-Code ein' });
            return false;
        }

        // Set up path
        const swpCode = encodeURIComponent(request.body.swpCode);
        const amount = encodeURIComponent(request.body.amount);
        this.options.path = `/swpsafe/check/code/${swpCode}/amount/${amount}`;

        // Set up request
        const callback = async (r: Response, d: object): Promise<boolean> => {

            // Parse CSV                             // NOTE: The capitalization of 'errormessage' is not a typo, but an inconsistency in the PaymentAPI
            const responseObject: { status: string, token: string, errormessage: string }[] = await this.parseCSV(d.toString());

            if(!responseObject){
                r.send(502);
                r.send({code: 502, message: 'Es gab einen Fehler. Bitte melden Sie sich mit folgender Nachricht bei einem Administrator: C502, Fehler während Anfrage auf die Bezahlungs-API'});
                return false;
            }

            const responseMessage = responseObject[0];

            // Validation successful
            if (responseMessage.status === '200') {
                this.token = responseMessage.token;

                // Store the order
                await this.db.createOrder(this.token, request.body.amount, request.cookies.sessionId, 'swpsafe');
                return true;
            }
            // Validation failed
            else {
                response.status(401); //unauthorized;
                response.send({
                    code: 401,
                    message: PaymentController.translateError(responseMessage.errormessage)
                });
                return false;
            }

        };

        // Make the request
        return await this.paymentAPICall(this.options, '', response, callback);
    }


    protected async executePayment(request: Request, response: Response): Promise<boolean> {
        if (this.token === undefined) {
            response.status(401);
            response.send({ code: 401, message: 'Es gab einen Fehler. Bitte melden Sie sich mit folgender Nachricht bei einem Administrator: C400, Kein Zahlungstoken vorhanden.'});
            return false;
        }

        // Set up path
        const token = encodeURIComponent(this.token);
        this.token = undefined;
        this.options.path = `/swpsafe/use/${token}`;

        // Set up request
        const callback = async (r: Response, d: object): Promise<boolean> => {

            // Parse CSV                             // NOTE: The capitalization of 'errormessage' is not a typo, but an inconsistency in the PaymentAPI
            const responseObject: { status: string, errormessage: string }[] = await this.parseCSV(d.toString());

            if(!responseObject){
                r.send(502);
                r.send({code: 502, message: 'Es gab einen Fehler. Bitte melden Sie sich mit folgender Nachricht bei einem Administrator: C502, Fehler während Anfrage auf die Bezahlungs-API'});
                return false;
            }

            const responseMessage = responseObject[0];

            // Payment successful
            if (responseMessage.status === '200') {
                response.status(200);
                response.send({ code: 200, message: 'Zahlung wurde erfolgreich durchgeführt' });
                return true;
            }
            // Payment failed
            else {
                response.status(401); //unauthorized;
                response.send({
                    code: 401,
                    message: PaymentController.translateError(responseMessage.errormessage)
                });
                return false;
            }

        };

        // Make the request 
        return await this.paymentAPICall(this.options, '', response, callback);

    } 

    public async refundPayment(request: Request, response: Response): Promise<void> {
        const order_id = request.body.order_id;

        const order = await this.db.getOrderById(order_id);

        if(!order){
            response.status(400);
            response.send({code: 400, message: 'C400, Keine Order vorhanden.'}); 
            return;
        }

        // Set up data
        const tokenURI = encodeURIComponent(order.token);
        this.options.path = `/swpsafe/return/${tokenURI}`;

        // Set up request 
        const callback = async (r : Response, d: Object) : Promise<boolean> => {
                
            const responseObject: { status: string, errormessage: string }[] = await this.parseCSV(d.toString());

            if (!responseObject) {
                r.send(502);
                r.send({ code: 502, message: 'Es gab einen Fehler. Bitte melden Sie sich mit folgender Nachricht bei einem Administrator: C502, Fehler während Anfrage auf die Bezahlungs-API' });
                return false;
            }

            const responseMessage = responseObject[0];

            // Refund successful
            if (responseMessage.status === '200') {
                response.status(200);
                response.send({ code: 200, message: 'Zahlung wurde erfolgreich storniert' });

                // Delete order
                await this.db.deleteOrder(order_id);      // Tickets will be automatically deleted through the CASCADE
                return true;
            }
            // Error during refund
            else {
                response.status(401); //unauthorized;
                response.send({
                    code: 401,
                    message: PaymentController.translateError(responseMessage.errormessage)
                });
                return false;
            }

        };

        // Make the request
        this.paymentAPICall(this.options, '', response, callback);

    }

    /*
        Parses specifically the responses from the CSV API 
        --> Generalized to allow different types of return objects
    */
    private parseCSV<T>(d: string) : Promise<T[]> {
        return new Promise(
            (resolve) => csv().fromString(d).then(
                (val) => resolve(val)
            )

        );

    }
}