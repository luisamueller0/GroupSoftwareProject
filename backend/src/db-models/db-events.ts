// used for interactions with the Events table of the database
import { Database } from '../database';
import { Event } from '../models/event';
import { Op } from 'sequelize';

export class EventManager {

    private db = Database.getInstance();
    public async getEventsWithLoc() : Promise<Event[]>{
        const today = new Date();
        try{
            const events = await this.db.Events.findAll({ //Select all from Events and Coordinates from Location FROM Events Join Locations on  Events.location = Locations.name WHERE end_date >= today 
            include: {model: this.db.Locations ,as: 'eventLocation', attributes: ['coordinates_lat','coordinates_lng']},
            attributes:{include: [[this.db.getSequelize().literal('FALSE'), 'is_past']]},
            where: {end_date: { [Op.gte]: today}}},);
            if(events){
                let eventsJson = JSON.stringify(events);
                // HTML Masking
                eventsJson = eventsJson.replace(/&amp;/g, '&');
                eventsJson = eventsJson.replace(/&quot;/g, '"');
                return JSON.parse(eventsJson);
            }
            return null;
        } catch(error) {
            console.error('Error retrieving Events with Location:',error);
        }
    } 

    public async getEventWithLocById(id : string) : Promise<Event>{
        try{
            const event = await this.db.Events.findOne({
            include: {model: this.db.Locations ,as: 'eventLocation', attributes: ['coordinates_lat','coordinates_lng']},
            where: {id: id}},);
            if(event){
                let eventsJson = JSON.stringify(event);
                eventsJson = eventsJson.replace(/&amp;/g, '&');
                eventsJson = eventsJson.replace(/&quot;/g, '"');
                
                const eventParsed : Event = JSON.parse(eventsJson);
                eventParsed.is_past = new Date(eventParsed.end_date) < new Date(); 
                return eventParsed;
            }
            return null;
        } catch(error) {
            console.error('Error retrieving Events with Location:',error);
        }
    } 
    
    public async getPastEvents() : Promise<Event[]>{
        const today = new Date();
        try{
            const events = await this.db.Events.findAll({ //Select all from Events and Coordinates from Location FROM Events Join Locations on  Events.location = Locations.name WHERE end_date < today 
            include: {model: this.db.Locations ,as: 'eventLocation', attributes: ['coordinates_lat','coordinates_lng']},
            attributes:{include: [[this.db.getSequelize().literal('TRUE'), 'is_past']]},
            where: {end_date: { [Op.lt]: today}}},);
            if(events){
                let eventsJson = JSON.stringify(events);
                eventsJson = eventsJson.replace(/&amp;/g, '&');
                eventsJson = eventsJson.replace(/&quot;/g, '"');
                return JSON.parse(eventsJson);
            }
            return null;
        } catch(error) {
            console.error('Error retrieving Events with Location:',error);
        }
    }    
}