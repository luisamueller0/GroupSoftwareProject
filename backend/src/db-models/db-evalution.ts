import { Database } from '../database';
import { QueryTypes } from 'sequelize';
import { UserManager } from './db-users';
import { Evaluation } from '../models/evaluation';

export class evaluationManager{
    private db = Database.getInstance();

    private userDB = new UserManager();

    public async createEvaluation(event_id:number,stars:number,description:string,anonym:boolean, sessionId:string):Promise<void>{
            const user = (await this.userDB.getUserBySessionId(sessionId));
            if(!user){
                throw(console.error('no userid found')); 
            }
            const user_id = user.id;
            const sequelize = this.db.getSequelize();
            await sequelize.query('INSERT INTO "evaluation" ( "anonym","user_id","event_id","stars","description") VALUES (?,?,?,?,?)',
            {
                replacements:[anonym,user_id,event_id,stars,description],
                type: QueryTypes.INSERT
            });

            return;
    }
    
    public async changeEvaluation(event_id:number, stars:number,description:string,anonym:boolean, sessionId:string):Promise<void>{
        const user = (await this.userDB.getUserBySessionId(sessionId));
        if(!user){
            throw(console.error('no userid found'));
        }
        const user_id = user.id;
        const evaluation = await this.getEvaluation(event_id, sessionId);
        if(!evaluation){
            throw(console.error('no evaluation with this userId'));
        }
        const sequelize = this.db.getSequelize();
        await sequelize.query(
            'UPDATE PUBLIC.evaluation'+
            'SET  evaluation.stars = ?, evaluation.description = ?, evaluation.anonym = ?'+
            'Where evaluation.event_id = ? AND evaluation.user_id = ?',
            {
                replacements: [stars, description, anonym, event_id,user_id],
                type: QueryTypes.UPDATE
            }
        );
        return;
    }
    public async deleteEvaluation(event_id:number, sessionId:string):Promise<void>{
        const user = await this.userDB.getUserBySessionId(sessionId);
        if(!user){
            throw(new Error('no userid found'));
        }
        const user_id = user.id;
        const sequelize = this.db.getSequelize();
        await sequelize.query(
            'DELETE'+
            'FROM  PUBLIC.evaluation'+
            'WHERE evaluation.event_id = ? AND evaluation.user_id = ?',
            {
                replacements: [event_id,user_id],
                type: QueryTypes.DELETE
            }

        );
    }
    public async getEvaluation(event_id:number, sessionId:string):Promise<Evaluation>{
        const user = (await this.userDB.getUserBySessionId(sessionId));
        if (!user) {
            throw new Error('no userid found');
        }
        const user_id = user.id;
        const sequelize = this.db.getSequelize();
        const evaluation = await sequelize.query(
            'Select * '+
            'From PUBLIC.evaluation ' +
            'Where evaluation.event_id = ? AND evaluation.user_id = ?'
            ,
            {
                type: QueryTypes.SELECT,
                replacements: [event_id, user_id]
            }
        );

        if(!evaluation || evaluation.length === 0){
            return null;
        }

        return JSON.parse(JSON.stringify(evaluation));
        
    }
    public async deleteHelpful(eval_id: string, sessionId: string) :Promise<void>{
        const user = await this.userDB.getUserBySessionId(sessionId);
        if(!user){
            throw(new Error('no userid found'));
        }
        const user_id = user.id;

        const sequelize = this.db.getSequelize();
        await sequelize.query(
            'DELETE '+
            'FROM PUBLIC.helpful '+
            'WHERE helpful.eval_id = ? AND helpful.user_id = ?',
            {
                replacements: [eval_id,user_id],
                type: QueryTypes.DELETE
            }

        );
    }
    public async evaluateHelpful(eval_id: number, helpful: boolean, sessionId:string) :Promise<void>{
        const user = await this.userDB.getUserBySessionId(sessionId);
        if(!user){
            throw(new Error('no userid found'));
        }

        const sequelize = this.db.getSequelize();

        const user_id = user.id;
        if(await this.getHelpful(eval_id,user_id) !== '[]'){
            sequelize.query(
                'UPDATE PUBLIC.helpful '+
                'SET helpful = ? '+
                'Where helpful.eval_id = ? AND helpful.user_id = ?',
                {
                    type: QueryTypes.UPDATE,
                    replacements: [helpful,eval_id,user_id]
                }
            );
        } 
        else{ 
            sequelize.query(
                'INSERT INTO "helpful" ("eval_id","user_id","helpful") VALUES (?,?,?)',
                {
                    type: QueryTypes.INSERT,
                    replacements: [eval_id,user_id,helpful]
                }
            );
        }    
    }
    private async getHelpful(eval_id: number, user_id:number): Promise<string>{
        const sequelize = this.db.getSequelize();
        const evaluation = await sequelize.query(
            'Select * '+
            'From PUBLIC.helpful JOIN PUBLIC.evaluation ON helpful.eval_id = evaluation.id ' +
            'Where helpful.eval_id = ? AND helpful.user_id = ?'
            ,
            {
                type: QueryTypes.SELECT,
                replacements: [eval_id, user_id]
            }
        );
        return JSON.stringify(evaluation);
    }
    public async getEvaluations(event_id:string, sessionId:string):Promise<Evaluation[]>{
        const user = await this.userDB.getUserBySessionId(sessionId); 
        let user_id;
        if(!user){
            user_id = -1;
        }else{
            user_id = user.id;
        }

        const sequelize = this.db.getSequelize();
        const evaluation = await sequelize.query(
            'SELECT evaluation.id, evaluation.stars , users.firstname, users.lastname, evaluation.description, evaluation.anonym, (evaluation.user_id = ?) AS own_evaluation, ' + 
            'COUNT(CASE WHEN helpful.helpful = true THEN 1 END) AS helpful, ' + 
            'COUNT(CASE WHEN helpful.helpful = false THEN 1 END) AS not_helpful ' +
            'FROM PUBLIC.evaluation JOIN PUBLIC.users ON evaluation.user_id = users.id ' +
            'LEFT JOIN PUBLIC.helpful ON evaluation.id = helpful.eval_id ' + 
            'WHERE evaluation.event_id = ? ' +
            'GROUP BY evaluation.id , evaluation.stars, users.firstname, users.lastname, evaluation.user_id, evaluation.description, evaluation.anonym' 
            ,
            {
                type: QueryTypes.SELECT,
                replacements: [user_id, event_id]
            }
        );

        if(!evaluation){
            return null;
        }

        const evalJSON = JSON.parse(JSON.stringify(evaluation));

        return evalJSON.map((ev : Evaluation) => {ev.helpful = Number(ev.helpful); ev.not_helpful = Number(ev.not_helpful); return ev;});      // this is done to ensure that the "helpful"/"not_helpful" variables actually get passed on as numbers
    }

    public async checkEvaluation(event_id : number, sessionId:string): Promise<boolean>{
        
            const evaluation = await this.getEvaluation(event_id,sessionId);
            if(!evaluation){
                return true;
            }
            else {
                return false;
            }
    }
    public async getEvaluationHelpful(eval_id : string, sessionId:string): Promise<string>{
        const user = await this.userDB.getUserBySessionId(sessionId); 
        const sequelize = this.db.getSequelize();
        const helpful = await sequelize.query(
            'SELECT helpful.helpful ' +
            'FROM PUBLIC.helpful JOIN PUBLIC.evaluation ON helpful.eval_id = evaluation.id ' +
            'WHERE helpful.user_id = ? AND evaluation.id = ?'
        ,
        {
            type: QueryTypes.SELECT,
            replacements: [user.id,eval_id],
            plain: true
        }
    );
    return JSON.stringify(helpful);
    }
}