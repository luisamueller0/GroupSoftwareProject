import { Request, Response } from 'express';
import { DeleteUserController} from './db-models/db-deleteUser';
export class DeleteUserManager{
    private db = new DeleteUserController;

    public async deleteProfile(request:Request,response:Response):Promise<void> {


        try {

          await this.db.anonymTickets(request.cookies.sessionId);

          await this.db.deleteUser(request.cookies.sessionId);

            response.status(200);
            response.send({
                code: 200,
                message: 'profil gelöscht'
            });
        } catch (error) {
            response.status(400);
            console.error(error);
            return;
        }



    }

}
