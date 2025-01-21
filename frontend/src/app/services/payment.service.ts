import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TicketService } from './ticket.service';
import { CartService } from './cart.service';
import { ResponseMessage } from '../models/messages';
import { Observable, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { InputBC, InputHCIPal, InputSWPSafe } from '../models/paymentInput';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http : HttpClient, private ticketService: TicketService , private cartService: CartService, private router: Router) { }

  public paySWP(input: InputSWPSafe) : Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>('/api/payment/swpsafe/pay', {
      swpCode: input.code,
      amount: input.amount.replace('€', '').replace(',', '.')
    });
  }

  public payHCIPal(input: InputHCIPal) : Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>('/api/payment/hcipal/pay', {
      accountName: input.email,
      accountPassword: input.password,
      amount: input.amount.replace('€', '').replace(',', '.')
    });
  } 

  public payBC(input: InputBC): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>('/api/payment/bachelorcard/pay', {
      name: input.name,
      cardNumber: input.cardNumber,
      securityCode: input.securityCode,
      expirationDate: input.expirationDate,
      amount: input.amount.replace('€', '').replace(',', '.')
    });
  }

  public async paymentProcess(buyWarenkorb: boolean, eventId : number, typeToAmount : number[],  input: InputBC | InputHCIPal | InputSWPSafe) : Promise<ResponseMessage | null> {

    let paymentObservable : Observable<ResponseMessage>;

    /*
        Generate the paymentObservable (dependent on the used service)
    */
    switch(input.service){
      case 'bachelorcard':
        paymentObservable = this.payBC(input);
        break;
      case 'hcipal':
        paymentObservable = this.payHCIPal(input);
        break;
      case 'swpsafe':
        paymentObservable = this.paySWP(input);
        break;
      default:
        console.error('paymentProcess function called with nonexistent payment method!');
        return null;
    }

  
    try{
      const val = await firstValueFrom(paymentObservable);

      // Payment Process successful
      if (buyWarenkorb) {
        this.cartService.buyCart();
      }
      else {
        this.ticketService.createTickets(eventId, typeToAmount).subscribe({
          next: () => {
            return;
          },
          error: (err) => {
            console.error(err);
          }
        });
      }

      this.router.navigateByUrl('/payment/success');
      return val;
    }
    catch(e: unknown) {
      const val = e as {error: ResponseMessage};
      if(!val){                               // if the error is not from us (i.e. not of type ResponseMessage)
        return null;  
      }
      return val.error;   
    }

  }

}
