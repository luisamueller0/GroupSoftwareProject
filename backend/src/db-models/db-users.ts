// used for interactions with the Users and Sessions tables of the database

import { Database } from '../database';
import { Session } from '../models/session';
import { User } from '../models/user';
import bcrypt from 'bcrypt';

export class UserManager{

    private db = Database.getInstance();
    public async createUser(user : User) : Promise<void>{
        await this.db.Users.create({firstname: user.firstname, lastname: user.lastname, street : user.street, number : user.number, postalcode : user.postalcode, place : user.place, email : user.email, password : user.password});
    }

    public async createSession(sessionId : string, userId : number) : Promise<void>{
        await this.db.Sessions.create({id: sessionId,user_id : userId});
    }

    public async getSessionById(sessionId: string): Promise<Session> {
        try {
            const session = await this.db.Sessions.findByPk(sessionId); // search in Sessions table for session with primary key
            if (session) {
                const sessionObject: Session = {
                sessionId: session.getDataValue('id'),
                userId: session.getDataValue('user_id'),
            };
            return sessionObject;
            }
            return null;
        } catch (error) {
            console.error('Error retrieving session:', error);
        }
    }

    public async getUserBySessionId(sessionId: string): Promise <User> {
        const session = await this.getSessionById(sessionId); //Search for the session first

        try {
            const user = await this.db.Users.findOne({
                where: {id : session.userId}
            }); // get the user id, which we found through the sessions
            if (user) {

            return user.toJSON();
            }
            return null;
        } catch (error) {
            console.error('Error retrieving user by Session:', error);
        }
    }
    public async setUserByEmail(request: User): Promise<boolean>{
        const firstname: string  = request.firstname;
        const lastname: string = request.lastname;
        const street: string = request.street;
        const number: string = request.number;
        const postalcode: string = request.postalcode;
        const place: string = request.place;
        const email: string = request.email;
        let password: string = request.password;
        const user= await this.db.Users.findOne({
            where: {email : email}
        });

        if(user){
            if(firstname){
            await user.update({firstname: firstname});
            }
            if(lastname){
            await user.update({lastname: lastname});
            }
            if(street){
            await user.update({street: street});
            }
            if(number){
            await user.update({number: number});
            }
            if(postalcode){
            await user.update({postalcode: postalcode});
            }
            if(place){
            await user.update({place: place});
            }
            if(password){
            password = await bcrypt.hash(password,10);
            await user.update({password: password});

            }
            return true;
        }
        return false;
    }

    public async getUserByEmail(email : string) : Promise <User> {
        try {
            const user = await this.db.Users.findOne({
                where: {email : email}
            });
            if (user) {
                return user.toJSON();
            }
            return null;
        } catch (error) {
            console.error('Error retrieving user by Email:', error);
        }
    }

    public async deleteSession(session: Session) : Promise<void>{

        try{
            this.db.Sessions.destroy({
                where: {
                    id : session.sessionId
                }
            });

        } catch (error) {
            console.error('Error deleting session:', error);
        }
    }



}







