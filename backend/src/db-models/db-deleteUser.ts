import { QueryTypes } from 'sequelize';
import { Database } from '../database';
import { UserManager } from './db-users';


export class DeleteUserController{
    private db = Database.getInstance();
    private userDB = new UserManager();
    public async deleteUser(sessionId:string):Promise<void>{
        const user = await this.userDB.getUserBySessionId(sessionId);
        if(!user){
            throw(new Error('no userid found'));
        }
        const user_id = user.id;

        const sequelize = this.db.getSequelize();
        await sequelize.query(
        'DELETE ' +
        'FROM public.users ' +
        'WHERE id = ? ',{
            type: QueryTypes.DELETE,
            replacements: [user_id],
        });
    }

    public async anonymTickets(sessionId:string): Promise<void>{
        const user = await this.userDB.getUserBySessionId(sessionId);
        if(!user){
            throw(new Error('no userid found'));
        }
        const user_id = user.id;
        const sequelize = this.db.getSequelize();
        await sequelize.query(
        'UPDATE public.tickets ' +
        'SET user_id = null '+
        'WHERE user_id = ?',{
            type: QueryTypes.UPDATE,
            replacements: [user_id]
        });

    }
}
