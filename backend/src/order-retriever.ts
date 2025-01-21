import { OrderManager } from './db-models/db-orders';
import { Request, Response } from 'express';


export class OrderRetriever {
    private db = new OrderManager();

    public async getOrders(request: Request, response: Response) : Promise<void>{
        const sessionId = request.cookies.sessionId;

        const orders = await this.db.getOrdersBySession(sessionId);

        if(!orders){
            response.status(404);
            response.send({code: 404, message: 'No orders found.'});
            return;
        }

        response.status(200);
        response.send(orders);
        return;
    }

    public async checkIncludePastTickets(request : Request, response : Response) : Promise<void>{
        try{
            let order_id : string; 
            if(typeof request.query.order_id === 'string'){
                order_id = request.query.order_id;
            }
            const check = await this.db.checkIncludePastTickets(order_id);
            response.send(check);
        }
        catch(err){
            console.error(err);
            response.status(400);
            response.send({code: 400, message: 'Error checking if past tickets are included'});
        }
    }

    
}