import { Order } from '../models/order';
import { Database } from '../database';
import { UserManager } from './db-users';
import { Op, Sequelize } from 'sequelize';

export class OrderManager {
    protected db: Database;
    protected users:UserManager;
    constructor(){
        this.db = Database.getInstance();
        this.users = new UserManager();
    }

    public async createOrder(token: string, price: number, sessionId: string, service: string) : Promise<void> {

        const user = await this.users.getUserBySessionId(sessionId);

        try{
            await this.db.Orders.create({token: token, price: price, user_id : user.id,
                placed_on: this.db.getSequelize().literal('CURRENT_TIMESTAMP(0) AT TIME ZONE \'Europe/Rome\''), // (0) rounds to full seconds
                service: service});       
            return;
        }
        catch(err){
            console.error(err);
            return;
        }
    }

    public async deleteOrder(id: number) : Promise<void>{
        try{
            await this.db.Orders.destroy({where: {id: id}});
            return;
        }
        catch(err){
            console.error(err);
            return;
        }
    }

    public async getOrdersBySession(sessionId: string) : Promise<Order[]> {
        try{
            const user = await this.users.getUserBySessionId(sessionId);
            const orders = await this.db.Orders.findAll({where: {user_id: user.id}});
            if(!orders){
                return null;
            }

            const orderJSON : Order[] = JSON.parse(JSON.stringify(orders));
            return orderJSON;
        }
        catch(err){
            console.error(err);
            return null;
        }
    }

    public async getOrderById(id: number) : Promise<Order> {
        try{
            const order = await this.db.Orders.findByPk(id);
            if(!order){
                return null;
            }
            return JSON.parse(JSON.stringify(order));
        }
        catch(err){
            console.error(err);
            return null;
        }
    }

    // Returns the most recent order
    public async getCurrentOrderId(user_id: number) : Promise<number | null> {
        try{
            const orders = await this.db.Orders.findOne({attributes: [[Sequelize.fn('MAX', Sequelize.col('id')), 'id']], 
                                                            where: {user_id: user_id}});
            if(!orders){
                return null;
            }

            const orderJSON : Order = JSON.parse(JSON.stringify(orders));
            return orderJSON.id;

        }
        catch(err){
            console.error(err);
            return null;
        }
    }

    public async checkIncludePastTickets(order_id : string) : Promise<boolean> {
        try{
            const ticket = await this.db.Tickets.findOne({
                include: [{ model: this.db.Events,
                    where: {end_date: {[Op.lt]: new Date()}}
                }],
                where: {order_id: order_id}
            });
            if(!ticket){
                return false;
            }
            return true;
        }
        catch(err){
            console.error(err);
        }
    }

}