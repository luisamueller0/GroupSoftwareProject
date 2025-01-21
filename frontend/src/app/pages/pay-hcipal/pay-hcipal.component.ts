import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TicketService } from 'src/app/services/ticket.service';
import { PaymentHeaderComponent } from 'src/app/components/payment-header/payment-header.component';
import { CartService } from 'src/app/services/cart.service';
import { PaymentService } from 'src/app/services/payment.service';
import { PageStatusService } from 'src/app/services/page-status.service';
import { InputHCIPal } from 'src/app/models/paymentInput';

@Component({
  selector: 'app-pay-hcipal',
  templateUrl: './pay-hcipal.component.html',
  styleUrls: ['./pay-hcipal.component.css']
})
export class PayHCIpalComponent {
  constructor(private router: Router, private location: Location, private ticketService : TicketService, private cartService: CartService, private paymentService : PaymentService, private pageStatus: PageStatusService){}

  @ViewChild(PaymentHeaderComponent) header_info! : PaymentHeaderComponent;


  public ticketPrice = localStorage.getItem('ticketPrice') as string;
  public eventId = parseInt(localStorage.getItem('eventId') as string);
  public buyShoppingCartString = localStorage.getItem('buyWarenkorb') as string ;
  public buyWarenkorb = this.buyShoppingCartString === 'true';

  public bools: boolean[] =  new Array(4).fill(true);//alle Eingaben per default richtig
  public msgs: String[] =new Array(4).fill(''); //alle messages per default leer


  public loading = false;
  public outputVisible = false;
  public outcome = ' ';


  public email = '';
  public password = '';


  cancel(): void{
    this.pageStatus.setNavigationBar();
    this.location.back();
  }

  async checkInput(): Promise<void> {
    this.loading = true;
    this.outputVisible = false;
    this.outcome = '';

    const input : InputHCIPal = {email: this.email, password: this.password, amount: this.ticketPrice, service: 'hcipal'};

    const responseMessage = await this.paymentService.paymentProcess(this.buyWarenkorb, this.eventId, this.header_info.typeToAmount, input);

    if(!responseMessage){
      this.loading = false;
      return;
    }

    if(responseMessage.code === 200){
      this.pageStatus.setNavigationBar();
    }
    else {
      this.outcome = responseMessage.message;
    }

    this.outputVisible = true;
    this.loading = false;
  }

}


