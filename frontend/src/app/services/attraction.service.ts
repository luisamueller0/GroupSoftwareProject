import { Injectable } from '@angular/core';
import { Attraction } from '../models/attraction';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttractionService {

    constructor(private http: HttpClient) { }

    public attraction?: Attraction;



    public getAttractions():Observable<Attraction[]>{
        const attractionOberservable = this.http.get<Attraction[]>('/api/attraction').pipe(shareReplay());
        return  attractionOberservable;
    }

    public getAttractionById(id : string): Observable<Attraction>{
        const params = new HttpParams().set('id',id);
        const attractionOberservable = this.http.get<Attraction>('api/single-attraction',{params}).pipe(shareReplay());
        return attractionOberservable;
    }

}
