import { Request, Response } from 'express';
import { LocationManager } from './db-models/db-locations';

export class AttractionController {

    private db = new LocationManager;

     public async getAttractions(request : Request, response : Response) : Promise<void> {
        const locations = await this.db.getLocations();

        if(!locations){
            response.status(404);
            response.send({code : 404, message : 'Locations could not be found!'});
            return;
        }
        
        locations.forEach(l => { l.name = l.name.replace(/&quot;/g,'"');                    // translation needed due to database entries
                                 l.name = l.name.replace(/&amp;/g,'&');    });

        response.status(200);
        response.send(locations);
    }

    public async getAttractionById(request : Request, response: Response) : Promise<void> {
        let id : string;
        if(typeof request.query.id === 'string'){
            id = request.query.id;
        }
        const location = await this.db.getLocationById(id);
        if(!location){
            response.status(404);
            response.send({code : 404, message: 'Location by Id not found'});
            return;
        }

        location.name = location.name.replace(/&quot;/g, '"');
        location.name = location.name.replace(/&amp;/g, '&');

        response.status(200);
        response.send(location);
    }

}