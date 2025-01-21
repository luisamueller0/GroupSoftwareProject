import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cartEvent } from 'src/app/models/cartEvents';
import { CartService } from 'src/app/services/cart.service';
import { PageStatusService } from 'src/app/services/page-status.service';


@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  constructor(private cartService: CartService, private router: Router, private pageStatus: PageStatusService){}

  public showPopup = false;

  public allCartEvents :cartEvent[] = [];
  public nothingInTheCart = false;

  public endPreis ?: string;
  public lengthZero = true;

  ngOnInit():void{

    this.cartService.getCart().subscribe({
      next: (val:cartEvent[]) => {
        this.allCartEvents = val;
        if(this.allCartEvents.length === 0){
          this.nothingInTheCart = true;
        }else{
          this.lengthZero = false;
        }
        this.calculateTotalPrice();
      },
      error: (err: cartEvent[]) => {
        this.allCartEvents = [{
          event_id: -1,
          title: 'error',
          child_amount: -1,
          senior_amount: -1,
          student_amount: -1,
          normal_amount: -1,
          picture: 'error',
          normal_price: 'error',
          senior_price: 'error',
          student_price: 'error',
          child_price: 'error',
          total_price: 'error'
        }];
        console.error('ShoppingCart not found:'+err);
      }
    });



  }

  calculateTotalPrice(): number {
    let totalPrice = 0;

    for (const cartEvent of this.allCartEvents) {
      const eventTotalPrice: number = parseFloat(cartEvent.total_price);
      totalPrice += eventTotalPrice;
    }

    this.endPreis = totalPrice.toFixed(2);

    return totalPrice;
  }

  buyCart():void{
    localStorage.setItem('eventName', 'Warenkorb kaufen');
    localStorage.setItem('eventDate', '');
    localStorage.setItem('ticketPrice', this.endPreis + '€' );
    localStorage.setItem('buyWarenkorb', 'true');

    this.router.navigateByUrl('/payment');

  }
  openPopup(): void {
    this.showPopup= true;
  }

  closePopup(): void {
    this.showPopup= false;
  }

  deleteCart(): void {
    this.showPopup= false;
    this.cartService.deleteCart();
    this.pageStatus.refreshView();
  }
}
