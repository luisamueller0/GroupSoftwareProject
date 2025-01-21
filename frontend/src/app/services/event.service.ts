import { Observable, shareReplay } from 'rxjs';
import { Event } from '../models/events';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as Leaflet from 'leaflet';

@Injectable({
    providedIn: 'root'
  })

export class EventService {
    constructor(private http: HttpClient) { }

    public event?: Event;
    public location?: Location;


    public getEvents():Observable<Event[]>{
        const eventOberservable = this.http.get<Event[]>('/api/events').pipe(shareReplay());
        return eventOberservable;
    }


    public getPastEvents():Observable<Event[]>{
        const eventOberservable = this.http.get<Event[]>('/api/past-events').pipe(shareReplay());
        return eventOberservable;
    }

    public getEventById(id : string) : Observable<Event> { 
        const params = new HttpParams().set('id',id);
        const eventOberservable = this.http.get<Event>('/api/single-event',{params}).pipe(shareReplay());
        return eventOberservable;
    }

    public createEvaluation(event_id: number, sterne: number, description:string, anonym:boolean):Observable<void>{
        const registerObservable = this.http.post<void>('/api/evaluate', {
          event_id: event_id,
          sterne: sterne,
          description: description,
          anonym: anonym
        }).pipe(shareReplay());
        return registerObservable;
      }



    public cutoffAfterOpeningBracket(text: string): string {
        const klammerAufIndex = text.indexOf('(');
      
        if (klammerAufIndex !== -1) {
          return text.slice(0, klammerAufIndex);
        }
      
        return text;
    }

    public convertDate(datum: string): string {
        const teile = datum.split('-');
        const tag = teile[2];
        const monat = teile[1];
        const jahr = teile[0];
      
        return `${tag}.${monat}.${jahr}`;
    }

    public convertPriceFormat(preis: string): string {

        if(!preis){         // passiert, wenn ein Event z.B. keine besonderen Preise für Senioren anbietet
            return preis;
        }

        const betrag = preis.slice(1); // Entferne das Währungssymbol '$'
        const waehrung = '€';
        
        return `${betrag.replace('.', ',')}${waehrung}`;
    }
    public convertToLatLng(coords: number[]): Leaflet.LatLng {
        return Leaflet.latLng(coords[0], coords[1]);
    }
    public priceToNumber(p: string): number {
        const stringValue = p.slice(1);
        return parseFloat(stringValue);
    }
}