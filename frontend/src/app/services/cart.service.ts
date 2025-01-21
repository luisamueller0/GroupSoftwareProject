import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseMessage } from '../models/messages';
import { Observable, shareReplay } from 'rxjs';
import { cartEvent } from '../models/cartEvents';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }

  public addToCart(event_id : number, normal_amount: number,child_amount : number, senior_amount : number, student_amount : number, total_price : number) : Observable<ResponseMessage>{
    const cartObservable = this.http.post<ResponseMessage>('/api/add-item', {
      event_id: event_id,
      normal_amount: normal_amount,
      child_amount: child_amount,
      senior_amount: senior_amount,
      student_amount: student_amount,
      total_price: total_price
    }).pipe(shareReplay());
    return cartObservable;
}


public getCart():Observable<cartEvent[]>{
  const cartObservable = this.http.get<cartEvent[]>('/api/cart').pipe(shareReplay());
  return cartObservable;
}

public deleteCart() : void{
  const cartObservable = this.http.delete<ResponseMessage>('/api/delete-cart').pipe(shareReplay());
  cartObservable.subscribe({
    next: () => {
      return;
    },
    error: (err) =>{
      console.error(err);
    }
  });
  return;
}


public buyCart(): void{
  const cartObservable = this.http.post<ResponseMessage>('/api/buy-cart', {}).pipe(shareReplay());
  cartObservable.subscribe({
    next: () => {
      return;
    },
    error: (err) =>{
      console.error(err);
    }
  });
  return;
}

public deleteItem(event_id: string): void{
  const params = new HttpParams().set('event_id',event_id);
  const cartObservable = this.http.delete<ResponseMessage>('/api/delete-item',
  {params}).pipe(shareReplay());
  cartObservable.subscribe({
    next: () => {
      return;
    },
    error: (err) =>{
      console.error(err);
    }
  });
  return;
}


}
