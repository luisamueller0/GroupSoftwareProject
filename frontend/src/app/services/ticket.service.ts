import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { TicketGroup } from '../models/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient) { }


  createTickets(eventId: number, typeAmounts: number[]):Observable<void> {

    const ticketObservable = this.http.post<void>('/api/create-ticket', {eventId: eventId, typeAmounts: typeAmounts }).pipe(shareReplay());
    return ticketObservable;
  }


  public getTickets():Observable<TicketGroup[]>{
    const ticketOberservable = this.http.get<TicketGroup[]>('/api/tickets').pipe(shareReplay());
    return ticketOberservable;
}

public getPastTickets():Observable<TicketGroup[]>{
  const ticketOberservable = this.http.get<TicketGroup[]>('/api/past-tickets').pipe(shareReplay());
  return ticketOberservable;
}


  convertToNumber(value : string | null ): number {
    if(value === null){
      throw new Error('value is null');
    }
    const parsedValue = parseFloat(value);
    
    if (isNaN(parsedValue)) {
      throw new Error('Invalid number');
    }
    
    return parsedValue;
  }


}
