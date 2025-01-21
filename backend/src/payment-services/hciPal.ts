import { Request, Response } from 'express';
import { PaymentController } from '../payment';
import { Option } from '../models/option';


export class HCIPalSercive extends PaymentController {

    protected options : Option = {
        hostname : 'pass.hci.uni-konstanz.de',
        port : 443,
        path : '',                              // will be set up later
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Content-Length' : undefined        // will be set up later
        }   
    };


    protected async validateCountry(request: Request, response: Response): Promise<boolean> {
        // Empty Request Body
        if (!request.body.accountName) {
            response.status(400);
            response.send({ code: 400, message: 'Bitte geben Sie all ihre Zahlungsdaten ein' });
            return false;
        }

        // Set up data 
        const data = JSON.stringify({
            accountName: request.body.accountName
        });

        // Set up request 
        this.options.path = '/hcipal/country';
        this.options.headers['Content-Length'] = data.length;

        const callback = async (r: Response, d: object): Promise<boolean> => {
            const responseMessage = JSON.parse(d.toString());

            // Country successfully verified
            if (responseMessage.success === true) {

                // Country is germany
                if (responseMessage.country === 'germany') {
                    // Payment is from germany, request can continue
                    return true;
                }

                // Country isn't germany
                else {
                    r.status(401);   // Unauthorized
                    r.send({ code: 401, message: 'Zahlung stammt nicht aus Deutschland'});
                    return false;
                }
            }
            else {
                r.status(401);
                r.send({ code: 401, message: PaymentController.translateError(responseMessage.error) });
                return false;
            }
        };


        // Make the request
        return await this.paymentAPICall(this.options, data, response, callback);

    }

    protected async validatePayment(request: Request, response: Response): Promise<boolean> {
        // Empty Request Body
        if (!request.body.accountName || !request.body.accountPassword || !request.body.amount) {
            response.status(400);
            response.send({ code: 400, message: 'Bitte geben Sie all ihre Zahlungsdaten ein' });
            return false;
        }

        // Set up data
        const data = JSON.stringify({
            accountName: request.body.accountName,
            accountPassword: request.body.accountPassword,
            amount: request.body.amount
        });

        // Set up request
        this.options.headers['Content-Length'] = data.length;
        this.options.path = '/hcipal/check';

        const callback = async (r: Response, d: object): Promise<boolean> => {
            const responseMessage = JSON.parse(d.toString());

            // Validation successful
            if (responseMessage.success === true) {
 
                this.token = responseMessage.token;

                // Store the order
                await this.db.createOrder(this.token, request.body.amount, request.cookies.sessionId, 'hcipal');
                return true;
            }
            else {
                r.status(401); // unauthorized
                r.send({ code: 401, message: PaymentController.translateError(responseMessage.error) });
                return false;
            }
        };

        // Make the request
        return await this.paymentAPICall(this.options, data, response, callback);
    }
    
    protected async executePayment(request: Request, response: Response): Promise<boolean> {
        if (this.token === undefined) {
            response.status(401);
            response.send({ code: 401, message: 'Es gab einen Fehler. Bitte melden Sie sich mit folgender Nachricht bei einem Administrator: C400, Kein Zahlungstoken vorhanden.'});
            return false;
        }

        const data = JSON.stringify({ token: this.token });
        this.token = undefined;

        // Set up request
        this.options.path = '/hcipal/payment';
        this.options.headers['Content-Length'] = data.length;

        const callback = async (r: Response, d: object): Promise<boolean> => {
            const responseMessage = JSON.parse(d.toString());

            // Payment successful
            if (responseMessage.success === true) {
                r.status(200);
                r.send({ code: 200, message: 'Zahlung wurde erfolgreich durchgeführt' });          // when successful, a response is sent (but only at the "executePayment" stage)
                return true;
            }
            // Payment unsuccessful
            else {
                r.status(401); // Unauthorized
                r.send({ code: 401, message: PaymentController.translateError(responseMessage.error) });
                return false;
            }
        };

        // Make the request
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

        // Set up data
        const data = JSON.stringify({token: order.token});

        // Set up request 
        this.options.path = '/hcipal/payback';
        this.options.headers['Content-Length'] = data.length;

        const callback = async (r: Response, d: Object) : Promise<boolean> => {
            const responseMessage = JSON.parse(d.toString());

            // Stornieren erfolgreich
            if (responseMessage.success === true) {
                r.status(200);
                r.send({ code: 200, message: 'Zahlung wurde erfolgreich storniert' });

                // Order löschen
                await this.db.deleteOrder(order_id);      // Tickets werden über die CASCADE automatisch mitgelöscht
               
                return true;
            }
            // Fehler beim Stornieren
            else {
                r.status(401); // Unauthorized
                r.send({ code: 401, message: PaymentController.translateError(responseMessage.error) });
                return false;
            }
        };

        // Make the request
        this.paymentAPICall(this.options, data, response, callback);
    }
}