import { Request, Response } from 'express';
import { EventManager } from './db-models/db-events';

export class EventController{
    private db = new EventManager;

    public async getEvents(request: Request, response: Response) : Promise<void>{
        const events = await this.db.getEventsWithLoc();
        if(!events){
            response.status(404); //ressource not found
            response.send({code: 404, message: 'Event with Location not found!'});
        }

        response.status(200);
        response.send(events);
    }

    public async getEvent(request: Request, response: Response) : Promise<void>{
        let id : string;
        if(typeof request.query.id === 'string'){
            id  = request.query.id;
        }
        const events = await this.db.getEventWithLocById(id);
        if(!events){
            response.status(404); //ressource not found
            response.send({code: 404, message: 'Event with Location not found!'});
        }
        response.status(200);
        response.send(events);
    }
    public async getPastEvents(request: Request, response: Response) : Promise<void>{
        const events = await this.db.getPastEvents();
        if(!events){
            response.status(404);
            response.send({code: 404, message: 'Past events not found'});
        }
        response.status(200);
        response.send(events);
    }
}