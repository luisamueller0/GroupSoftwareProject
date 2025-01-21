import { ShoppingCartManager } from './db-models/db-shopping-cart';
import { Request, Response } from 'express';

export class ShoppingCartController{
    private shoppingCartDB = new ShoppingCartManager();

    public async addItem(request : Request,response : Response) : Promise<void>{
        try{
            const event_id = request.body.event_id;
            const normal_amount = request.body.normal_amount;
            const child_amount = request.body.child_amount;
            const senior_amount = request.body.senior_amount;
            const student_amount = request.body.student_amount;
            await this.shoppingCartDB.addItem(request.cookies.sessionId,event_id,normal_amount,child_amount,senior_amount,student_amount);
            response.send({code: 200, message: 'item added'});
            response.status(200);
        }
        catch(err){
            console.error(err);
            response.status(400);
        }
        return;
    }
    public async getCart(request : Request,response : Response) : Promise<void>{
        try{
            const cart = await this.shoppingCartDB.getCart(request.cookies.sessionId);
            response.send(cart);
            response.status(200);
        }
        catch(err){
            console.error(err);
            response.status(400);
            response.send({code:400,message:'error getting cart'});
        }
        return;
    }

    public async deleteCart(request : Request,response : Response) : Promise<void>{
        try{
            await this.shoppingCartDB.deleteCart(request.cookies.sessionId);
            response.send({code: 200, message: 'cart deleted'});
            response.status(200);
        }
        catch(err){
            console.error(err);
            response.status(400);
            response.send({code:400,message:'error deleting cart'});
        }
        return;
    }

    public async buyCart(request: Request,response: Response) : Promise<void>{
        try{
            await this.shoppingCartDB.buyCart(request.cookies.sessionId);
            response.send({code: 200, message: 'cart bought'});
            response.status(200);
        }
        catch(err){
            console.error(err);
            response.status(400);
            response.send({code:400,message:'error buying cart'}); 
        }
    }

    public async deleteItem(request : Request,response: Response) : Promise<void> {
        try{
            let event_id : string; 
            if(typeof request.query.event_id === 'string'){
                event_id = request.query.event_id;
            }
            await this.shoppingCartDB.deleteItem(request.cookies.sessionId, event_id);
            response.send({code: 200, message: 'deleted item'});
            response.status(200);
        }
        catch(err){
            console.error(err);
            response.status(400);
            response.send({code:400,message:'error deleting item'});
        }
    }
}