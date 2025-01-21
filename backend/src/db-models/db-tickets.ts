import { QueryTypes} from 'sequelize';
import { Database } from '../database';
import { User } from '../models/user';
import {Ticket} from '../models/ticket';
import { Event } from '../models/event';
import { OrderTickets} from '../models/order-tickets';
import { OrderManager } from './db-orders';
import { UserManager } from './db-users';

export class TicketManager{
    /**
     * getTicketsbyUserId
     * @param id - userId
     * @returns - a array of json objects {jpg of the pricture: any, number of tickets: number, name of event: string, startdate of Event: Date, enddate of Event: Date or null if start = end }
     */

    private db = Database.getInstance();

    private orders = new OrderManager();
    private users = new UserManager();
    
    public async getTicketsbyUserId(id: number):Promise<Ticket[]>{
        const sequelize = this.db.getSequelize();
        const tickets = await sequelize.query(
        'SELECT events.picture, tickets.event_id, events.title, count(tickets.user_id) AS NUMBER, events.start_date, events.end_date ' +
        'FROM PUBLIC.tickets, PUBLIC.events ' +
        'WHERE tickets.event_id = events.id AND tickets.user_id = ? AND events.end_date >= ?'+
        'GROUP BY tickets.event_id, events.title,events.picture, events.start_date,events.end_date',
        {
            type: QueryTypes.SELECT,
            replacements: [id,new Date()],

        });

        let ticketString = JSON.stringify(tickets);
        // HTML Masking
        ticketString = ticketString.replace(/&amp;/g, '&');
        ticketString = ticketString.replace(/&quot;/g, '"');

        return JSON.parse(ticketString);

    }

    public async getTicketsByOrderId(order_id: number, sessionId: string) : Promise<OrderTickets[]> {
        const sq = this.db.getSequelize();
        const user = await this.users.getUserBySessionId(sessionId);

        if(!user){
            return null;
        }

        const tickets = await sq.query(
            'SELECT sum(CASE tickets.type WHEN 0 THEN 1 ELSE 0 end) AS normal_tickets, ' +
            'sum(CASE tickets.type WHEN 1 THEN 1 ELSE 0 end) AS child_tickets, ' +
            'sum(CASE tickets.type WHEN 2 THEN 1 ELSE 0 end) AS senior_tickets, ' +
            'sum(CASE tickets.type WHEN 3 THEN 1 ELSE 0 end) AS student_tickets, ' +
            'events.title, events.start_date, events.end_date ' + 
            'FROM PUBLIC.tickets, PUBLIC.events ' + 
            'WHERE tickets.order_id = ? AND tickets.event_id = events.id AND tickets.user_id = ? ' + 
            'GROUP BY events.title, events.start_date, events.end_date',
            {type: QueryTypes.SELECT,
             replacements: [order_id, user.id]}
        );

        let ticketString = JSON.stringify(tickets);
        ticketString = ticketString.replace(/&amp;/g, '&');
        ticketString = ticketString.replace(/&quot;/g, '"');

        return JSON.parse(ticketString);
                
    }

    public async getTicketsByUserAndEvent(user_id : number, event_id : string) : Promise<Ticket[]> {
        const tickets = await this.db.Tickets.findAll({
            where: {user_id: user_id, event_id: event_id}
        });

        if(tickets){
            const ticketsJSON = tickets.map(d => JSON.parse(JSON.stringify(d)));
            return ticketsJSON;
        }

        return null;

    }
    public async getPastTicketsbyUserId(id: number):Promise<Ticket>{
        const sequelize = this.db.getSequelize();
        const tickets = await sequelize.query(
        'SELECT events.picture, tickets.event_id, events.title, count(tickets.user_id) AS NUMBER, events.start_date, events.end_date ' +
        'FROM PUBLIC.tickets, PUBLIC.events ' +
        'WHERE tickets.event_id = events.id AND tickets.user_id = ? AND events.end_date < ? '+ 
        'GROUP BY tickets.event_id, events.title, events.picture, events.start_date,events.end_date',
        {
            type: QueryTypes.SELECT,
            replacements: [id,new Date()],

        });
        
        let ticketString = JSON.stringify(tickets);
        // HTML Masking
        ticketString = ticketString.replace(/&amp;/g, '&');
        ticketString = ticketString.replace(/&quot;/g, '"');

        return JSON.parse(ticketString);
    }

    public async getTicketbyId(id : number) : Promise<Ticket>{
        try{
            const ticket = await this.db.Tickets.findByPk(id);
            return JSON.parse(JSON.stringify(ticket));
        }
        catch(err){
            console.error(err);
            return null;
        }

    }




    public async createTicket(userId: number, eventId:number, type: number):Promise<void> { //type 0 = normal, 1 = child, 2 = senior, 3 = student 
        try{
            const order_id = await this.orders.getCurrentOrderId(userId);
            await this.db.Tickets.create({user_id: userId, event_id: eventId, type: type, order_id: order_id});
            return;
        }
        catch(err){
            console.error(err);
            return;
        }
    }

    public async getUserByTicket(ticketId : number) : Promise<User>{
        try{
            const ticketModel = await this.db.Tickets.findByPk(ticketId);
            const ticket : Ticket = JSON.parse(JSON.stringify(ticketModel));

            const user = await this.db.Users.findByPk(ticket.user_id);
            return JSON.parse(JSON.stringify(user));

        }
        catch(err){
            console.error(err);
            return null;
        }
    }

    public async getEventByTicket(ticketId : number) : Promise<Event> {
        try{
            const ticketModel = await this.db.Tickets.findByPk(ticketId);
            const ticket : Ticket = JSON.parse(JSON.stringify(ticketModel));

            const event = await this.db.Events.findByPk(ticket.event_id);
            return JSON.parse(JSON.stringify(event));

        }
        catch(err){
            console.error(err);
            return null;
        }
    }


}
