import { Request, Response} from 'express';
import { Option } from './models/option';
import { OrderManager } from './db-models/db-orders';


export abstract class PaymentController {

        // ORDERS (connection to database for orders table)
        protected db:OrderManager; 

        // TOKEN (for payment)
        protected token : string;
        

        protected https = require('https');

        protected options : Option;

        constructor(){
            this.db = new OrderManager();
        }

        // To avoid redundancy, we use a generalized function for all our api calls
        protected async paymentAPICall(options : Option, data : string, response : Response, callback : ((response : Response, d : object) => Promise<boolean>)) : Promise<boolean>{    

            return new Promise<boolean>(
                (resolve) => {
                    const req = this.https.request(options, (res: Response) => {
                        // API call successful
                        res.on('data', d => resolve(callback(response, d)));
                    });

                    // API call failed
                    req.on('error', () => {
                        response.status(502); // Bad Gateway
                        response.send({ code: 502, message: 'Es gab einen Fehler. Bitte melden Sie sich mit folgender Nachricht bei einem Administrator: C502, Fehler während Anfrage auf die Bezahlungs-API' });
                    });
                    req.write(data);
                    req.end();
                }
            );   
        }

        // the actual Payment call
        /* 
            Here we define a template method, where the individual steps (validateCountry, validatePayment, executePayment) will be implemented in the concrete subclasses
            The way this structure works is the following:
                1. execute and await validateCountry()
                        --> if the country is invalid/not germany, then the response object will already have sent a responseMessage withing the validateCountry() function
                        --> if the country is valid, then no response will be sent yet 
                2. if the country is valid (and the amount has a correct format), continue to execute validatePayment()
                        --> here the same logic applies
                3. if the payment is valid, then execute the payment
        */
        public async payment(request: Request, response: Response) : Promise<void> {

            const countryChecked = await this.validateCountry(request, response);
            
            if(countryChecked){

                // Incorrect amount format 
                if (isNaN(Number(request.body.amount)) || !request.body.amount) {
                    response.status(400);
                    response.send({ code: 400, message: 'Fehler: Der angegebene Zahlungspreis ist fehlerhaft.' });
                    return;
                }

                const paymentValid = await this.validatePayment(request, response);

                if(paymentValid){
                    await this.executePayment(request, response);
                    return;
                }
            }

            // This is a safety net in the (unexpected) case that no function sent a response
            if(!response.headersSent){
                response.status(502);
                response.send({code: 502, message: 'Es gab einen Fehler. Bitte melden Sie sich mit folgender Nachricht bei einem Administrator: C502, No response headers sent'});
                return;
            }

        }

        // Individual Payment services will have to define these methods
        /*
            Important Note for implementers: For the first three functions: 
                        --> If an error happens or the data is invalid, a response specifying the error should be sent and false is to be returned
                        --> If everything goes through, then *no* response is to be sent! Only for the last call "executePayment()" a response should be sent
        */
        protected abstract validateCountry(request: Request, response: Response) : Promise<boolean>;
        protected abstract validatePayment(request: Request, response: Response) : Promise<boolean>;
        protected abstract executePayment(request: Request, response: Response) : Promise<boolean>;

        public abstract  refundPayment(request: Request, response: Response) : Promise<void>;

        public static translateError(err: string):string{

            switch(err){
                case 'Invalid expiry date format':
                    return 'Ihr eingegebenes Datum besitzt ein falsches Format';

                case 'No request body provided':
                case 'Incomplete request body':
                case 'Invalid JSON':
                case 'Invalid payment token':
                    return 'Entschuldingen Sie, es gab einen Fehler';

                case 'Unknown payment account':
                case 'Could not find matching account, please retry with correct URL':
                    return 'Dieser Account konnte nicht gefunden werden';

                case 'Invalid data':
                    return 'Etwas stimmt mit Ihren angegebenen Daten nicht';

                case 'Account is frozen':
                    return 'Ihr Account ist eingefroren';

                case 'Not enough balance on account':
                    return 'Sie besitzen nicht genug Geld';

                case 'Bachelorcard is expired' :
                    return 'Ihre Bachelorkarte ist abgelaufen';

                default: 
                    const regex  = /^Missing\sdata:\s[^\s]+$/;
                    if (regex.test(err)) {
                        const subst = err.substring(14);
                        return 'Fehlende Daten: ' + subst;
                    }
                    return 'Unbekannter Fehler';
            }
        }

}