// used for interactions with the locations table of the database 
import { Database } from '../database';
import { Attraction } from '../models/attraction';

export class LocationManager {

    private db = Database.getInstance();
    public async getLocations() : Promise<Attraction[]>{

        try{
            const attractions = await this.db.Locations.findAll({raw:true});
            if(attractions){
                const attractionsJSON : Attraction[] = JSON.parse(JSON.stringify(attractions));
                return attractionsJSON;
            }
            else{
                return null;
            }
        }
        catch(error){
            console.error('Error retrieving locations', error);
            return null;
        }
    }
    public async getLocationById(id : string) : Promise<Attraction>{
        try{
            const attraction = await this.db.Locations.findOne({
                where: {id: id}
            });
            if(attraction){
                const attractionJson = JSON.parse(JSON.stringify(attraction));
                return attractionJson;
            }
            return null;
        }
        catch(error) {
            console.error('Error retrieving location by id', error);
            return null;
        }
    }

}