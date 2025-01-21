import app from '../src/app';
import request from 'supertest';
import { OrderManager } from '../src/db-models/db-orders';
import sinon from 'sinon';
import { Database } from '../src/database';


const paymentRequest = async (name: string, cardNumber: string, secCode: string, date: string, amount: string, expectedCode: number): Promise<request.Response> => {
    return request(app).
        post('/api/payment/bachelorcard/pay').
        send({
            name: name,
            cardNumber: cardNumber,
            securityCode: secCode,
            expirationDate: date,
            amount: amount
        }).
        expect(expectedCode);
};

/*
    Since API requests to the bachelorcard service seem to take up more time than on the hciPal/swpSafe services we increase our threshold to 20s
*/

describe('payment with bachelorcard',() => {

    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        sandbox.stub(OrderManager.prototype, 'createOrder').callsFake(async () => {return;});
        sandbox.stub(Database.prototype, 'initDB').callsFake(async () => {return;});
    }); 

    afterEach(() => {
        sandbox.restore();
    });

    /*
        ------------------------
        Sunny day scenario
        ------------------------
    */
    it('send a payment call with expected success to a https server and receive an answer',async () => {
        const response = await paymentRequest('Paul Milgramm', '4485-5420-1334-7098', '000', '4/44', '50', 200);

        expect(response.body.code).
        withContext('Correct status from the webserver').
        toBe(200);

        expect(response.body.message).
        toMatch(/erfolgreich/);

    },20000);



    /*
        ------------------------
        Expected Failures:
        ------------------------
    */
    it('send a payment call with expected failure (not enough money on account) to a https server and receive an answer', async() => {
        const response = await paymentRequest('Petra Heisenberg', '4556-0108-9131-6241', '123', '3/33', '50', 401);
    
        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(401);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 20000);

    it('send a payment call with expected failure (not a german payment account) to a https server and receive an answer', async() => {
        const response = await paymentRequest('Benjamin Schneider', '1010-1010-1010-1014', '101', '10/10', '10', 401);
    
        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(401);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 20000);

    it('send a payment call with expected failure (wrong card number) to a https server and receive an answer', async() => {
        const response = await paymentRequest('Paul Milgramm', '4415-5420-1334-7098', '000', '4/44', '10', 401);    	     
    
        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(401);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 20000);


    
    /*
        ------------------------
        Unusual/Unexpected Input:
        ------------------------
    */
    it('send a payment call with incorrectly formatted amount to a https server and receive an answer.', async() => {
        const response = await paymentRequest('Paul Milgramm', '4485-5420-1334-7098', '000', '4/44', 'abbabba', 400);

        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(400);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 20000);

    it('send a payment call with an impossibly large amount to a https server and receive an answer.', async() => {
        const response = await paymentRequest('Paul Milgramm', '4485-5420-1334-7098', '000', '4/44', '10000000000000000000000000000', 401);

        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(401);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 20000);

    it('send an empty payment request to a https server and receive an answer', async() => {
        const response = await paymentRequest('', '', '', '', '', 400);

        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(400);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 20000);

    it('send an payment request wiht some missing data to a https server and receive an answer', async() => {
        const response = await paymentRequest('Paul Milgramm', '4485-5420-1334-7098', '', '', '15', 400);

        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(400);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 20000);

});