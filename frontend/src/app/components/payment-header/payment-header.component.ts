import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-payment-header',
  templateUrl: './payment-header.component.html',
  styleUrls: ['./payment-header.component.css']
})
export class PaymentHeaderComponent {
      
  @Input()
  showEvent = true;

  // Event Data
  public eventName = localStorage.getItem('eventName') as string;
  public eventDate = localStorage.getItem('eventDate') as string;
  public eventID = localStorage.getItem('eventId') as string;
  public ticketPrice = localStorage.getItem('ticketPrice') as string;

  // Different Tickets
  public ticketAmount = localStorage.getItem('normalAmount') as string;
  public childAmount = localStorage.getItem('childAmount') as string;
  public seniorAmount = localStorage.getItem('seniorAmount') as string;
  public studentAmount = localStorage.getItem('studentAmount') as string;

  public hasSpecialTickets = this.childAmount + this.seniorAmount + this.studentAmount !== '000';

  public typeToAmount = [Number(this.ticketAmount), Number(this.childAmount), Number(this.seniorAmount), Number(this.studentAmount)];

  //Warenkorb
  public buyWarenkorbString = localStorage.getItem('buyWarenkorb') as string;
  public buyWarenkorb = this.buyWarenkorbString === 'true';
   
}
