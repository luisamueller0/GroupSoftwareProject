import app from '../src/app';
import request from 'supertest';
import { OrderManager } from '../src/db-models/db-orders';
import sinon from 'sinon';
import { Database } from '../src/database';


const paymentRequest = async (code: string, amount: string, expectedCode: number): Promise<request.Response> => {
    return request(app).
        post('/api/payment/swpsafe/pay').
        send({
            swpCode: code,
            amount: amount
        }).
        expect(expectedCode);
};

describe('payment with swpSafe',() => {

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
        const response = await paymentRequest('y^t@y7#uMYu@', '50', 200);

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
        const response = await paymentRequest('^iexa&8#53iE', '10', 401);
    
        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(401);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 10000);

    it('send a payment call with expected failure (not a german payment account) to a https server and receive an answer', async() => {
        const response = await paymentRequest('Ms7wa#%@^9Xi', '10', 401);
    
        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(401);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 10000);

    it('send a payment call with expected failure (not a known payment account) to a https server and receive an answer', async() => {
        const response = await paymentRequest('AAA', '10', 502);    	        // We expect a bad gateway here, since an unknown payment account of the swpSafe provider means sending a request to an invalid swp URL
    
        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(502);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 10000);



    /*
        ------------------------
        Unusual/Unexpected Input:
        ------------------------
    */
    it('send a payment call with incorrectly formatted amount to a https server and receive an answer.', async() => {
        const response = await paymentRequest('y^t@y7#uMYu@', 'abbabba', 400);

        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(400);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 10000);

    it('send a payment call with an impossibly large amount to a https server and receive an answer.', async() => {
        const response = await paymentRequest('y^t@y7#uMYu@', '10000000000000000000000000000', 401);

        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(401);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 10000);

    it('send an empty payment request to a https server and receive an answer', async() => {
        const response = await paymentRequest('', '', 400);

        expect(response.body.code).
        withContext('Error message from webserver').
        toBe(400);

        expect(response.body.message).not.toMatch(/erfolgreich/);

    }, 10000);

});