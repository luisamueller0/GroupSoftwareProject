import { Order } from 'src/app/models/orders';
import { orderTicket } from 'src/app/models/orderTicket';
import { Observable, shareReplay } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseMessage } from '../models/messages';

@Injectable({
    providedIn: 'root'
  })

export class OrderService {
    constructor(private http: HttpClient) { }

    public order?: Order;
    public orderTicket?: orderTicket;


    public getOrders():Observable<Order[]>{
      const orderOberservable = this.http.get<Order[]>('/api/orders').pipe(shareReplay());
      return orderOberservable;
    }

    public getOrderTickets(order_id: number):Observable<orderTicket[]>{
      const orderTicketOberservable = this.http.post<orderTicket[]>('/api/order-tickets' , {
        order_id: order_id
      }).pipe(shareReplay());
      return orderTicketOberservable;
    }

    public refundOrder(order_id: number, service: string) : Observable<ResponseMessage> {
      const refundObservable = this.http.post<ResponseMessage>(`/api/payment/${service}/payback`, {order_id: order_id}).pipe(shareReplay());
      return refundObservable;
    }

    public checkIncludesPastTickets(order_id : number) : Observable<boolean> {
      const params = new HttpParams().set('order_id',order_id);
      const checkOberservable = this.http.get<boolean>('/api/includes-past' , 
      {params}).pipe(shareReplay());
      return checkOberservable;
    }

    public getTicketType(type: number) : string {

      switch (type) {
        case 0:
          return 'Standardticket';
        case 1:
          return 'Kinderticket';
        case 2:
          return 'Seniorenticket';
        case 3:
          return 'Schüler/Studierendenticket';
        default:
          return 'Error';
      }

    }

    public convertBuyDate(date: string): string {
   
      const date_dformat = new Date(date); // Convert into date object
       
      const dStamp = date.split('T')[0];  // format is:  yyyy-mm-ddT(time)
      const dStamp_parts = dStamp.split('-');
      const y = dStamp_parts[0];
      const m = dStamp_parts[1];
      const d = dStamp_parts[2];
  
      const t = date_dformat.toTimeString().slice(0, 8);    // time format is hh:mm:ss Timezone
  
      return `${d}.${m}.${y} ${t} Uhr`;
  }
  
  
}
