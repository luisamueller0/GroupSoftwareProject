import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/orders';
import { OrderService } from 'src/app/services/orders.service';


@Component({
  selector: 'app-bestellungen',
  templateUrl: './bestellungen.component.html',
  styleUrls: ['./bestellungen.component.css']
})
export class BestellungenComponent implements OnInit {
  public allOrders : Order[] = [];
  public noOrder = false;
  public refund = false;

  constructor(private orderService: OrderService){}

  ngOnInit() : void {
    if(localStorage.getItem('refund') !== null){
      this.refund= true;
      setTimeout(() => { //after 2 seconds cancel
        localStorage.removeItem('refund');
        this.refund = false;
      }, 5000);
    }
    this.orderService.getOrders().subscribe({
      next: (val:Order[]) => {
        this.allOrders = val;
        if(this.allOrders.length === 0){
          this.noOrder = true;
        }
        else{
          this.noOrder = false;
        }
        },
        error: (err: Event[]) => {
          this.allOrders = [{
            id: -1,
            token: '-1',
            price: -1,
            user_id: -1,
            placed_on: '-1',
            service: '-1'
          }];
          console.error('Orders not found:'+err);
        }
    });
  }
}
