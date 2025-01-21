import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TicketService } from 'src/app/services/ticket.service';
import { PaymentHeaderComponent } from 'src/app/components/payment-header/payment-header.component';
import { CartService } from 'src/app/services/cart.service';
import { PaymentService } from 'src/app/services/payment.service';
import { PageStatusService } from 'src/app/services/page-status.service';
import { InputSWPSafe } from 'src/app/models/paymentInput';

@Component({
  selector: 'app-pay-swpsafe',
  templateUrl: './pay-swpsafe.component.html',
  styleUrls: ['./pay-swpsafe.component.css'],
})
export class PaySWPsafeComponent {
  constructor(private router: Router, private location: Location, private ticketService: TicketService , private cartService: CartService, private paymentService : PaymentService, private pageStatus: PageStatusService){}

  @ViewChild(PaymentHeaderComponent) header_info! : PaymentHeaderComponent;

  public ticketPrice = localStorage.getItem('ticketPrice') as string;
  public eventId = parseInt(localStorage.getItem('eventId') as string);

  public bool =  true;//Eingabe per default richtig
  public msg =''; // message per default leer

  public buyShoppingCartString = localStorage.getItem('buyWarenkorb') as string ;
  public buyShoppingCart = this.buyShoppingCartString === 'true';

  public outputVisible = false;
  public loading = false;
  public outcome = ' ';
  public numberId = 0;

  public code = '';

  public cancel(): void{
    this.pageStatus.setNavigationBar(); //navigation bar verwschwinden lassen
    this.location.back();
  }

  public async checkInput(): Promise<void> {
    this.loading = true;
    this.outputVisible = false;
    this.outcome = '';

    const input : InputSWPSafe = {code: this.code, amount: this.ticketPrice, service: 'swpsafe'};

    const responseMessage = await this.paymentService.paymentProcess(this.buyShoppingCart, this.eventId, this.header_info.typeToAmount, input);

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


