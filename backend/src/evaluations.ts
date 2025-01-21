import { Request, Response } from 'express';
import { evaluationManager } from './db-models/db-evalution';


export class evaluationController{
    private evaluationDB = new evaluationManager();
    
    
    
    
    /**
     * 
     * @param request: die Request ist ein JSON-Objekt der form: {event_id:integer,stars:integer 1-5,descrption: varchar(300), anonym: boolean} 
     * @param response: ResponseMessage ist vom Type eine ResponseMessage mit {status:HTML-code, message: String}
     * @returns 
     */
    public async addEvaluation(request: Request, response: Response):Promise<void>{
        try{
            const event_id:number = request.body.event_id;
            const stars: number = request.body.stars;
            const description:string = request.body.description;
            const anonym:boolean= request.body.anonym;
            await this.evaluationDB.createEvaluation(event_id, stars, description, anonym, request.cookies.sessionId);
            response.send({code: 200, message: 'evaluated'});
            response.status(200);
        }
        catch(err){
            console.error(err);
            response.status(400);
        }
        return;
    }
    /**
     *  
     * @param request: die Request muss die eventId enhalten
     * @param response: 
     * @returns 
     */
    public async getEvaluation(request: Request, response: Response):Promise<void>{ // gets evaluation written by user for specified event 
        try{
            const event_id = request.body.event_id;
            const evalString = await this.evaluationDB.getEvaluation(event_id, request.cookies.sessionId);
            response.send(evalString);
            response.status(200);
            return;
        }
        catch(err){
            console.error(err);
            response.status(400);
            response.send({code:400, message:'no user_id found'});
            return;
        }
        
    }
    public async getEvaluations(request:Request, response: Response):Promise<void>{
        try {
            let event_id: string;
            if(typeof request.query.event_id === 'string'){
                event_id = request.query.event_id;
            }
            const evaluation = await this.evaluationDB.getEvaluations(event_id, request.cookies.sessionId);
            response.send(evaluation);
            response.status(200);
            return;
            
        } catch (err) {
            console.error(err);
            response.status(400);
            return;
        }   
    }
    /**
     * Die Funktion erzeugt ein helpful eintrag wenn es keinen gibt für diese User_id und event_id, ansonsten wird der Helpful-Eintrag verändert
     * @param request eval_id:number,helpful:boolean
     * @param response code:number, message:string wenn alles geklappt hat
     * @returns 
     */
    public async helpful(request: Request, response: Response):Promise<void>{
        const eval_id:number = request.body.eval_id;
        const helpful:boolean = request.body.helpful;
        try{
            await this.evaluationDB.evaluateHelpful(eval_id, helpful, request.cookies.sessionId);
            response.send({code: 200, message: 'add helpful'});
            response.status(200);
        }
        catch(err){
            console.error(err);
            response.status(400);
        }
        return;
    }
    /**
     * Die funktion löscht einen helpful-Eintrag mit der eval_id, und user_id des angemeldeten users
     * @param request {eval_id:number}
     * @param response {code:number, message:string} wenn alles geklappt hat
     * @returns 
     */
    public async deleteHelpful(request: Request, response: Response):Promise<void>{
        let eval_id : string; 
        if(typeof request.query.eval_id === 'string'){
            eval_id = request.query.eval_id;
        }
        try{
            await this.evaluationDB.deleteHelpful(eval_id, request.cookies.sessionId);
            response.send({code: 200, message: 'delete helpful'});
            response.status(200);
        }
        catch(err){
            console.error(err);
            response.status(400);
        }
        return;
        }
    
    public async checkEvaluation(request: Request, response: Response):Promise<void>{
        try{ 
            const event_id = request.body.event_id;
            const check = await this.evaluationDB.checkEvaluation(event_id,request.cookies.sessionId);
            response.send(check);
            response.status(200);
            return;
        }
        catch(err){
            console.error(err);
            response.status(400);
            response.send({code: 400, message: 'incorrect/invalid event-id'});
            return;
        }
    }
    public async getEvaluationHelpful(request: Request, response : Response):Promise<void>{
        try{ 
            let eval_id: string;
            if(typeof request.query.eval_id === 'string'){
                eval_id = request.query.eval_id;
            }

            const helpful = await this.evaluationDB.getEvaluationHelpful(eval_id,request.cookies.sessionId);
            response.send(helpful);
            response.status(200);
            return;
        }
        catch(err){
            console.error(err);
            response.status(400);
            return;
        }
    }
}