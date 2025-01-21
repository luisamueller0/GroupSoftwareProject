import { Request, Response } from 'express';
import { PaymentController } from '../payment';
import { Option } from '../models/option';
import xml = require('xml2js')


export class BCService extends PaymentController {

    protected options : Option = {
        hostname : 'pass.hci.uni-konstanz.de',
        port : 443, //https port
        path: '/bachelorcard',                   
        method: 'POST',
        headers: {
            'Content-Type' : 'application/xml',
            'Content-Length' : undefined        // will be set up later 
        }
    };

    protected async validateCountry(request: Request, response: Response): Promise<boolean> {
        // Empty Request Body
        if (!request.body.cardNumber) {
            response.status(400);
            response.send({ code: 400, message: 'Bitte geben Sie all ihre Zahlungsdaten ein' });
            return false;
        }


        // Set up data
        const cardNumber = request.body.cardNumber;

        const data =
            `<?xml version="1.0" encoding="utf-8"?>
                <transactionRequest type="country">
                <version>1.0.0</version>
                <merchantInfo>
                    <name>Insel Mainau - Mainau Explorer</name>
                </merchantInfo>
                <cardNumber>${cardNumber}</cardNumber>
                </transactionRequest>            
                `;

        // Set up request
        this.options.headers['Content-Length'] = data.length;

        const callback = async (r: Response, d: object): Promise<boolean> => {

            // Parse XML
            const responseMessage : {status : string, 'transaction-data': {country : string}, error: string} = await this.parseXML(d.toString());
        
            if(!responseMessage){
                response.status(502); // Bad Gateway
                response.send({ code: 502, message: 'Es gab einen Fehler. Bitte melden Sie sich mit folgender Nachricht bei einem Administrator: C502, Fehler während Anfrage auf die Bezahlungs-API' });
                return false;
            }

            // Country validation successful
            if (responseMessage.status === '200: Success') {

                // Country is Germany 
                if (responseMessage['transaction-data'].country === 'de') {
                    // valid country, process can continue
                    return true;
                }
                // Country isn't Germany
                else {
                    r.status(401);
                    r.send({ code: 401, message: 'Zahlung stammt nicht aus Deutschland'});
                    return false;
                }
            }
            // Country validation unsuccessful
            else {
                r.status(401);
                r.send({ code: 401, message: PaymentController.translateError(responseMessage.error) });
                return false;
            }
 
        };

        // Make request
        return await this.paymentAPICall(this.options, data, response, callback);
    }

    protected async validatePayment(request: Request, response: Response): Promise<boolean> {
        // Empty Request Body
        if (!request.body.name || !request.body.cardNumber || !request.body.securityCode || !request.body.expirationDate) {
            response.status(400);
            response.send({ code: 400, message: 'Bitte geben Sie all ihre Zahlungsdaten ein' });
            return false;
        }

        // Set up Data 
        const name = request.body.name;
        const cardNumber = request.body.cardNumber;
        const securityCode = request.body.securityCode;
        const expirationDate = request.body.expirationDate;
        const amount = request.body.amount;

        const data =
            `<?xml version="1.0" encoding="utf-8"?>
                <transactionRequest type="validate">
                <version>1.0.0</version>
                <merchantInfo>
                    <name>Insel Mainau - Mainau Explorer</name>
                </merchantInfo>
                <payment type="bachelorcard">
                    <paymentDetails>
                        <cardNumber>${cardNumber}</cardNumber>
                        <name>${name}</name>
                        <securityCode>${securityCode}</securityCode>
                        <expirationDate>${expirationDate}</expirationDate>
                    </paymentDetails>
                    <dueDetails>
                        <amount>${amount}</amount>
                        <currency>EUR</currency>
                        <country>de</country>
                    </dueDetails>
                </payment>
                </transactionRequest>
                `;

        // Set up Request 
        this.options.headers['Content-Length'] = data.length;

        const callback = async (r: Response, d: object): Promise<boolean> => {

            // Parse XML
            const responseMessage: { status: string, 'transaction-data': { transactionCode: string }, error: string } = await this.parseXML(d.toString());

            if(!responseMessage){
                response.status(502); // Bad Gateway
                response.send({ code: 502, message: 'Es gab einen Fehler. Bitte melden Sie sich mit folgender Nachricht bei einem Administrator: C502, Fehler während Anfrage auf die Bezahlungs-API'});
                return false;
            }

            // Validation successful
            if (responseMessage.status === '200: Success') {
                this.token = responseMessage['transaction-data'].transactionCode;

                // Store the order
                await this.db.createOrder(this.token, request.body.amount, request.cookies.sessionId, 'bachelorcard');
                return true;
            }
            // Validation unsuccessful
            else {
                r.status(401);
                r.send({ code:401, message: PaymentController.translateError(responseMessage.error) });
                return false;
            }


        };


        // Make the Request
        return await this.paymentAPICall(this.options, data, response, callback);
    
    }
    
    protected async executePayment(request: Request, response: Response): Promise<boolean> {
        if(this.token === undefined){
            response.status(401);
            response.send({code: 401, message: 'Es gab einen Fehler. Bitte melden Sie sich mit folgender Nachricht bei einem Administrator: C400, Kein Zahlungstoken vorhanden.'});
            return false;
        }
        const transactionCode = this.token;
        this.token = undefined;

        const data = `<?xml version="1.0" encoding="utf-8"?>
        <transactionRequest type="pay">
        <version>1.0.0</version>
        <merchantInfo>
            <name>Insel Mainau - Mainau Explorer</name>
        </merchantInfo>
        <transactionCode>${transactionCode}</transactionCode>
        </transactionRequest>
        `;

        // Set up Request
        this.options.headers['Content-Length'] = data.length;

        const callback = async (r : Response, d : object) : Promise<boolean> => {

            // Parse xml

            const responseMessage: { status: string, error: string} = await this.parseXML(d.toString());

            if (!responseMessage) {
                response.status(502); // Bad Gateway
                response.send({ code: 502, message: 'Es gab einen Fehler. Bitte melden Sie sich mit folgender Nachricht bei einem Administrator: C502, Fehler während Anfrage auf die Bezahlungs-API'});
                return false;
            }

            // Validation successful
            if (responseMessage.status === '200: Success') {                    // Only now we send the success-message
                r.status(200);
                r.send({ code: 200, message: 'Zahlung wurde erfolgreich durchgeführt' });
                return true;
            }
            // Validation unsuccessful
            else {
                r.status(401);
                r.send({ code: 200, message: PaymentController.translateError(responseMessage.error) });
                return false;
            }

        };

        // Make Request
        return await this.paymentAPICall(this.options, data, response, callback);
    }
 
    public async refundPayment(request: Request, response: Response): Promise<void> {
        const order_id = request.body.order_id;

        const order = await this.db.getOrderById(order_id);

        if(!order){
            response.status(400);
            response.send({code: 400, message: 'Keine Order vorhanden.'}); 
            return;
        }
        
        // SET UP DATA 
        const data = `<?xml version="1.0" encoding="utf-8"?>
        <transactionRequest type="cancellation">
        <version>1.0.0</version>
        <merchantInfo>
            <name>Insel Mainau - Mainau Explorer</name>
        </merchantInfo>
        <transactionCode>${order.token}</transactionCode>
        </transactionRequest>
        `;

        // SET UP REQUEST
        this.options.headers['Content-Length'] = data.length;

        const callback = async (r : Response, d : object) : Promise<boolean> => {

            // Parse XML
            const responseMessage: { status: string, error: string} = await this.parseXML(d.toString());

            if (!responseMessage) {
                response.status(502); // Bad Gateway
                response.send({ code: 502, message: 'Es gab einen Fehler. Bitte melden Sie sich mit folgender Nachricht bei einem Administrator: C502, Fehler während Anfrage auf die Bezahlungs-API' });
                return false;
            }

            // Validation successful
            if (responseMessage.status === '200: Success') {
                r.status(200);
                r.send({ code: 200, message: 'Zahlung wurde erfolgreich storniert' });

                // Order löschen
                await this.db.deleteOrder(order_id);      // Tickets werden über die CASCADE automatisch mitgelöscht

                return true;
            }
            // Validation unsuccessful
            else {
                r.status(401);
                r.send({ code: 401, message: PaymentController.translateError(responseMessage.error) });
                return false;
            }

        };

        // MAKE THE REQUEST
        this.paymentAPICall(this.options, data, response, callback);
    }

    /*
        Parses specifically the responses from the XML API 
        --> Generalized to allow different types of return objects
    */
    private parseXML<T>(d: string) : Promise<T> {
        const xmlParser = new xml.Parser({explicitArray: false});

        return new Promise(
            (resolve) => xmlParser.parseString(d,

                (err, result) => {
                    resolve(result.transactionResponse.response);   // we only want the response from the returned xml file
                }
            )
        );
    }

} 
