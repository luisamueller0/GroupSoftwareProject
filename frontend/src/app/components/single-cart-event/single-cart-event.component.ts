import { Component , Input, OnInit} from '@angular/core';
import { cartEvent } from 'src/app/models/cartEvents';
import { CartService } from 'src/app/services/cart.service';
import { EventService } from 'src/app/services/event.service';
import { Router } from '@angular/router';
import { PageStatusService } from 'src/app/services/page-status.service';

@Component({
  selector: 'app-single-cart-event',
  templateUrl: './single-cart-event.component.html',
  styleUrls: ['./single-cart-event.component.css']
})
export class SingleCartEventComponent implements OnInit{

  @Input() cartEvent?:cartEvent;

  constructor(private eventService: EventService, private cartService: CartService, private router: Router, private pageStatus: PageStatusService){}

  public isChildTicket = false;
  public isSeniorTicket = false;
  public isStudentTicket = false;
  public isNormalTicket = false;

  public src = '/img/preLoad/grünesBild.jpg';

  public showPopup = false;


  ngOnInit(): void {
    if(this.cartEvent){
      this.cartEvent={
        event_id: this.cartEvent.event_id,
        title: this.eventService.cutoffAfterOpeningBracket(this.cartEvent.title),
        normal_amount: this.cartEvent.normal_amount,
        child_amount: this.cartEvent.child_amount,
        senior_amount: this.cartEvent.senior_amount,
        student_amount: this.cartEvent.student_amount,
        picture: this.cartEvent.picture,
        normal_price: this.removeDollarSign(this.cartEvent.normal_price),
        senior_price: this.removeDollarSign( this.cartEvent.senior_price),
        child_price: this.removeDollarSign(this.cartEvent.child_price),
        student_price: this.removeDollarSign(this.cartEvent.student_price),
        total_price: this.removeDollarSign(this.cartEvent.total_price)
      };
      this.src = '/img/events/' + this.cartEvent?.picture;

      if(this.cartEvent.normal_amount !== 0){
          this.isNormalTicket = true;
      }
      if(this.cartEvent.senior_amount !== 0){
        this.isSeniorTicket = true;

      }
      if(this.cartEvent.student_amount !== 0){
        this.isStudentTicket = true;

      }
      if(this.cartEvent.child_amount !== 0){
        this.isChildTicket = true;
      }

    }
  }

  public openPopup():void{
    this.showPopup = true;
  }
  public closePopup():void{
    this.showPopup = false;
  }

  public deleteSingleCartEvent():void{
    if(this.cartEvent){
      this.cartService.deleteItem(this.cartEvent?.event_id.toString());
    }
    this.pageStatus.refreshView();
  }

  public removeDollarSign(str : string) :string {

    if(str === null){
      return '0';
    }

    if (str.charAt(0) === '$') {
      return str.slice(1);
    }
    return str;
  }


}
