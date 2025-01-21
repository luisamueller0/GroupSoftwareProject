import { QueryTypes } from 'sequelize';
import { Database } from '../database';
import { UserManager } from './db-users';
import { TicketManager } from './db-tickets';

export class ShoppingCartManager{
    private db = Database.getInstance();
    private userDB = new UserManager();
    private ticketDB = new TicketManager();


    private async checkEventInCart(user_id: number,event_id : number) : Promise<boolean>{
        const sequelize = this.db.getSequelize();
        const check = await sequelize.query(
            'SELECT * FROM PUBLIC.shopping_cart WHERE user_id = ? AND event_id = ?',
            {
                replacements:[user_id,event_id],
                type: QueryTypes.SELECT,
                plain: true
            }  
        );
        if(!check){
            return false;
        }
        else{
            return true;
        }

    }
    public async addItem(sessionId : string,event_id :number,normal_amount : number,child_amount :number,senior_amount :number,student_amount :number) : Promise<void>{
        const user = (await this.userDB.getUserBySessionId(sessionId));
        if(!user){
            throw(console.error('no user found')); 
        }
        const user_id = user.id;
        const sequelize = this.db.getSequelize();
        if(await this.checkEventInCart(user_id,event_id)){
            await sequelize.query(
                'UPDATE PUBLIC.shopping_cart ' +
                'SET normal_amount = normal_amount + ? , child_amount = child_amount + ?, senior_amount = senior_amount + ?, student_amount = student_amount + ? ' +
                'WHERE user_id = ? AND event_id = ?' ,
                {
                    replacements:[normal_amount,child_amount,senior_amount,student_amount,user_id,event_id]
                }
            );
        }
        else{
            await sequelize.query(
                'INSERT INTO "shopping_cart" ("user_id","event_id","normal_amount","child_amount","senior_amount","student_amount") ' +
                'VALUES (?,?,?,?,?,?)' , 
                {
                    replacements:[user_id,event_id,normal_amount,child_amount,senior_amount,student_amount],
                    type: QueryTypes.INSERT
                }
            );
        }
    }

    public async getCart(sessionId : string) : Promise<string>{
        const user = (await this.userDB.getUserBySessionId(sessionId));
        if(!user){
            throw(console.error('no user found')); 
        }
        const user_id = user.id;
        const sequelize = this.db.getSequelize();
        const cart = await sequelize.query(
            'SELECT sc.event_id, events.title, events.picture,sc.normal_amount, sc.child_amount, sc.senior_amount, sc.student_amount, ' +
            'sc.normal_amount * COALESCE(events.price::numeric, 0) AS normal_price, ' +
            'sc.child_amount * COALESCE(events.price_child::numeric, 0) AS child_price, ' +
            'sc.senior_amount * COALESCE(events.price_senior::numeric, 0) AS senior_price, ' +
            'sc.student_amount * COALESCE(events.price_student::numeric, 0) AS student_price, ' +
            'sc.normal_amount * COALESCE(events.price::numeric, 0) + ' +
            'sc.child_amount * COALESCE(events.price_child::numeric, 0) + ' + 
            'sc.senior_amount * COALESCE(events.price_senior::numeric, 0) + ' +
            'sc.student_amount * COALESCE(events.price_student::numeric, 0) AS total_price ' +
            'FROM PUBLIC.shopping_cart AS sc ' +
            'JOIN PUBLIC.events ON sc.event_id = events.id ' +
            'WHERE user_id = ?'
        , 
            {
                replacements:[user_id],
                type: QueryTypes.SELECT
            }
        );
        return JSON.stringify(cart);
    }

    public async deleteCart(sessionId : string) : Promise<void>{
        const user = (await this.userDB.getUserBySessionId(sessionId));
        if(!user){
            throw(console.error('no user found')); 
        }
        const user_id = user.id;
        const sequelize = this.db.getSequelize();
        await sequelize.query(
            'DELETE FROM PUBLIC.shopping_cart WHERE user_id = ?', 
            {
                replacements:[user_id],
                type: QueryTypes.DELETE
            }
        );
    }

    public async buyCart(sessionId : string) : Promise<void>{
        const user = (await this.userDB.getUserBySessionId(sessionId));
        if(!user){
            throw(console.error('no user found')); 
        }
        const user_id = user.id;
        let cartItem : string;
        while((cartItem = await this.getCartItem(user_id)) !== 'null'){
            const item = JSON.parse(cartItem);
            await this.addTickets(user_id,item.event_id,0,item.normal_amount);
            await this.addTickets(user_id,item.event_id,1,item.child_amount);
            await this.addTickets(user_id,item.event_id,2,item.senior_amount);
            await this.addTickets(user_id,item.event_id,3,item.student_amount);
            await this.deleteItem(sessionId,item.event_id);
        }
    }

    public async deleteItem(sessionId : string,event_id: string) : Promise<void>{
        const user = (await this.userDB.getUserBySessionId(sessionId));
        if(!user){
            throw(console.error('no user found')); 
        }
        const user_id = user.id;
        const sequelize = this.db.getSequelize();
        await sequelize.query(
            'DELETE FROM PUBLIC.shopping_cart WHERE user_id = ? AND event_id = ?' , 
            {
                replacements:[user_id,event_id],
                type: QueryTypes.DELETE
            } 
            
            );
    }

    private async getCartItem(userId : number) : Promise<string> {
        const sequelize = this.db.getSequelize();
        const item = await sequelize.query(
            'SELECT * FROM PUBLIC.shopping_cart WHERE user_id = ? LIMIT 1',
            {
                replacements:[userId],
                type: QueryTypes.SELECT,
                plain: true
            }
        );
        return JSON.stringify(item);
    }
    private async addTickets(user_id : number,event_id : number,type : number,amount : number) : Promise<void>{
        for(let i = 0; i < amount; i++){
            await this.ticketDB.createTicket(user_id,event_id,type);
        }    
    }
}