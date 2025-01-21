import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseMessage } from '../models/messages';
import { Observable, shareReplay } from 'rxjs';
import { Rating } from '../models/rating';
import { CurrentEval } from '../models/currentEval';

@Injectable({
    providedIn: 'root'
  })
  export class EvaluationService {
    constructor(private http: HttpClient) { }
    public createEvaluation(event_id : number,stars: number,description : string, anonym : boolean) : Observable<ResponseMessage>{
        const evalObservable = this.http.post<ResponseMessage>('/api/evaluate', {
          event_id: event_id,
          stars: stars,
          description: description,
          anonym: anonym
        }).pipe(shareReplay());
        return evalObservable;
    }

    public getEvaluation(event_id : number) : Observable<Rating[]> { 
      const params = new HttpParams().set('event_id',event_id);
      const eventOberservable = this.http.get<Rating[]>('/api/evaluations',{params}).pipe(shareReplay());
      return eventOberservable;
    }

  // Checks whether a ticket has been bought to an event or not 
  public canEvaluate(event_id: number): Observable<boolean> {
    const evalObservable = this.http.post<boolean>('/api/ticket-bought', {event_id: event_id}).pipe(shareReplay());
    return evalObservable;
  }

  // Checks whether an evaluation has been made or not
  public hasntEvaluated(event_id: number) : Observable<boolean> {
    const hasEvaluatedObs = this.http.post<boolean>('/api/check-evaluation', {event_id: event_id}).pipe(shareReplay());
    return hasEvaluatedObs;
  }


  public helpful(evalu_id : number, helpful : boolean) : void{
    const evalObservable = this.http.post<ResponseMessage>('/api/helpful-evaluate', {
      eval_id: evalu_id,
      helpful: helpful
    }).pipe(shareReplay());
    evalObservable.subscribe({
      next: () => {return;},
      error: (err : Error) => console.error(err)
    });
    return;
  }

  public getCurrentHelpful(evalu_id : number) : Observable<CurrentEval>{
    const params = new HttpParams().set('eval_id',evalu_id);
    const evalObservable = this.http.get<CurrentEval>('/api/evaluation-helpful', {params}).pipe(shareReplay());
    return evalObservable;
  }

  public removeHelpful(evalu_id : number) : Observable<ResponseMessage>{
    const params = new HttpParams().set('eval_id',evalu_id);
    const evalObservable = this.http.delete<ResponseMessage>('/api/helpful-delete',
      {params}).pipe(shareReplay());
    return evalObservable;
  }
  
}