import app from '../src/app';
import request from 'supertest';
import { OrderManager } from '../src/db-models/db-orders';
import sinon from 'sinon';
import { Database } from '../src/database';


const paymentRequest = async (email: string, password: string, amount: string, expectedCode: number): Promise<request.Response> => {
    return request(app).
        post('/api/payment/hcipal/pay').
        send({
            accountName: email,
            accountPassword: password,
            amount: amount
        }).
        expect(expectedCode);
};

describe('payment with hciPal',() => {

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
        const response = await paymentRequest('paul@milgram.de', 'zJac6Em^q7JrG@w!FMf4@', '50', 200);

        expect(response.body.code).
        withContext('Correct status from the webserver').
        toBe(200);

        expect(response.body.message).
        toMatch(/erfolgreich/);

    },10000);



    /*
        ------------------------
        Expected Failures:
        ------------------------
    */
    it('send a payment call with expected failure (not enough money on account) to a https server and receive an answer', async() => {
        const response = await paymentRequest('petra@heisenberg.eu', '6uTQu8DhqXVz!!fXpGcD5', '10', 401);
    
        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(401);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 10000);

    it('send a payment call with expected failure (not a german payment account) to a https server and receive an answer', async() => {
        const response = await paymentRequest('b.schneider@gov.us', '*REc#YbCMj6WaWmksYm9*', '10', 401);
    
        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(401);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 10000);

    it('send a payment call with expected failure (wrong password) to a https server and receive an answer', async() => {
        const response = await paymentRequest('paul@milgram.de', 'a', '10', 401);    	     
    
        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(401);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 10000);


    
    /*
        ------------------------
        Unusual/Unexpected Input:
        ------------------------
    */
    it('send a payment call with incorrectly formatted amount to a https server and receive an answer.', async() => {
        const response = await paymentRequest('paul@milgram.de', 'zJac6Em^q7JrG@w!FMf4@', 'abbabba', 400);

        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(400);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 10000);

    it('send a payment call with an impossibly large amount to a https server and receive an answer.', async() => {
        const response = await paymentRequest('paul@milgram.de', 'zJac6Em^q7JrG@w!FMf4@', '10000000000000000000000000000', 401);

        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(401);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 10000);

    it('send an empty payment request to a https server and receive an answer', async() => {
        const response = await paymentRequest('', '', '', 400);

        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(400);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 10000);

    it('send an payment request without an amount to a https server and receive an answer', async() => {
        const response = await paymentRequest('paul@milgram.de', 'zJac6Em^q7JrG@w!FMf4@', '', 400);

        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(400);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 10000);
}); 
