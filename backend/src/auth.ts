import { Request, Response, NextFunction } from 'express';
import { User } from './models/user';
import { Session } from './models/session';
import bcrypt from 'bcrypt';
import uid from 'uid-safe';
import { UserManager } from './db-models/db-users';
export class AuthController {

    private db = new UserManager;
   
    public async register(request: Request, response: Response):Promise<void>{
        const firstname: string =request.body.firstname;
        const lastname: string = request.body.lastname;
        const street: string = request.body.street;
        const number: string = request.body.number;
        const postalcode: string = request.body.postalcode;
        const place: string =request.body.place;
        const email: string = request.body.email;
        const password:  string = await bcrypt.hash(request.body.password,10);
        const user: User = await this.db.getUserByEmail(email);
        if(user){
          response.status(400);
          response.send({code: 400, message: 'Es gibt bereits einen User mit dieser E-Mailadresse'});
          console.error('doppelte Email');
          return;
        }

        await this.db.createUser({ id: -1, firstname: firstname, lastname: lastname, street: street, number: number, postalcode: postalcode, place: place, email: email, password: password }); // actual id will be assigned by database

        response.status(200);
        response.send({code: 200, message: 'Der Nutzer ist registriert'});
        return;
      }
    public async setUserInfo(request: Request, response: Response): Promise<void>{
       if(await this.db.setUserByEmail(request.body)){
        
            response.status(200);
            response.send({status: 200, message: 'Der Nutzer wurde geändert'});
        } else{
            response.status(400);
            }
    }
    

    // Checks if an authorization exists
    public async authorize(request: Request, response: Response, next : NextFunction) : Promise<void> {
        // Check if a sessionId is send through the cookies
        const sessionId = request.cookies.sessionId;
        if(!sessionId){
            return next();
        }

        // Check if a session with the sessionId exists
        const session : Session = await this.db.getSessionById(sessionId);
        if(!session){
            return next();
        }

        // Session can be saved
        response.locals.session = session;

        // Check if a user (that belongs to the session) exists
        const user : User = await this.db.getUserBySessionId(session.sessionId);
        if(!user){
            return next();
        }

        // User can be saved
        response.locals.user = user;
        return next();
    }

    public async login(request: Request, response: Response) : Promise<void> {
        
        const email: string = request.body.email;
        const password: string = request.body.password;

        // find User with given email
        const user: User = await this.db.getUserByEmail(email);

        if(!user){
            response.status(401); // 401: Unauthorized
            response.send({ code: 401, message: 'E-Mail Addresse nicht gefunden.' });
            return;
        }

        // Check if hashed password is correct
        if (!bcrypt.compareSync(password, user.password)) {
            response.status(401); // 401: Unauthorized
            response.send({ code: 401, message: 'Anmelden fehlgeschlagen. Daten erneut eingeben.' });
            return;
        }

        const sessionId = uid.sync(24);
        await this.db.createSession(sessionId,user.id);
        response.cookie('sessionId', sessionId, {httpOnly: true});
        response.status(200);
        response.send({code: 200, message: 'Anmelden Erfolgreich.'});

    }

    public async getAuth(request: Request, response: Response) : Promise<void>{

        if(!response.locals.session){
            response.status(200);
            response.send(false);
            return;
        }

        if(!await this.db.getSessionById(response.locals.session.sessionId)){
            response.status(200);
            response.send(false);
            return;
         }

        response.status(200);
        response.send(true);
        return;
    }

    public async logout(request: Request, response: Response) : Promise<void> {

        // Logout Request happens, but the user is not logged in in the first place
        if(!response.locals.session){       //accesses local storage used by other functions (mainly authorize())
            response.status(409);
            response.send({code: 409, message: 'Benutzer ist nicht angemeldet!'});
            return;
        }

        // Delete Session
        await this.db.deleteSession(response.locals.session);
        response.locals.session = undefined;

        // Delete Session Cookie
        response.status(200);
        response.clearCookie('sessionId');
        response.send({code: 200, message: 'Abmelden erfolgreich!'});
        return;
    }


    public async validatePassword(request: Request, response : Response) : Promise<void>{
        const email : string = request.body.email;
        const password : string = request.body.password;
        const user : User = await this.db.getUserByEmail(email);

        if(!user){  // Should never happen, just a safety net 
            response.status(401); // 401: Unauthorized
            response.send({ code: 401, message: 'E-Mail address not found' });
            return;
        }
        if(!bcrypt.compareSync(password, user.password)){
            response.status(401);  //unauthorized
            response.send({code: 401, message: 'Wrong Password'});
            return;
        }

        response.status(200);
        response.send({code: 200, message: 'Verification successful!'});
    }

    public async getUserInfo(request: Request, response: Response) : Promise<void> {
        const user : User = await this.db.getUserBySessionId(request.cookies.sessionId);
        
        // User not found
        if(!user){
            response.status(404); //ressource not found
            response.send({code: 404, message: 'User not found!'});
        }
        
        response.status(200);
        response.send(user);

    }
  

}




