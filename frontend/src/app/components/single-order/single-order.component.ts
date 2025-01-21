import { Component, Input, OnInit} from '@angular/core';
import { OrderService } from 'src/app/services/orders.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/orders';
import { orderTicket } from 'src/app/models/orderTicket';


@Component({
  selector: 'app-single-order',
  templateUrl: './single-order.component.html',
  styleUrls: ['./single-order.component.css']
})
export class SingleOrderComponent implements OnInit {

  @Input() orders?:Order; // kommt von orders.component.html
  public showDetails? : boolean;
  public allOrderTickets : orderTicket[] = [];
  public refundInProgress = false;
  public refundError = false;
  public showPopup = false;
  public showNoRefund = false;
  public includesPastTickets ?: boolean;
  public refundActivated = false;
  public refundMessage = 'Die Stornierung war erfolgreich.';


  private refundPrompt = 'Sind Sie sich sicher, dass Sie die Bestellung Stornieren möchten?';
  private refundErrorMessage = 'Es gab leider einen Fehler beim Storniervorgang! Melden Sie sich bitte mit folgender Meldung an einen Administrator: ';
  private refundLoadingText = 'Der Storniervorgang ist in Bearbeitung. Bitte haben Sie Geduld.';
  public errorMessage = '';
  public refundText = this.refundPrompt;




  constructor(private orderService: OrderService, private router: Router){}

  ngOnInit(): void {
    this.showDetails = false;
    if(this.orders){
      this.orders.placed_on = this.orderService.convertBuyDate(this.orders.placed_on);
    }

    if(this.orders){
    this.orderService.getOrderTickets(this.orders?.id).subscribe({
      next: (val:orderTicket[]) => {
        this.allOrderTickets = val;
        },
        error: (err: Event[]) => {
          this.allOrderTickets = [{
            normal_tickets: -1,
            child_tickets: -1,
            senior_tickets: -1,
            student_tickets: -1,
            title: 'Kein Titel Gefunden',
            start_date: '',
            end_date: ''
          }];
          console.error('Orders not found:'+err);
        }

      });
      this.orderService.checkIncludesPastTickets(this.orders?.id).subscribe({
        next: (val : boolean) => {
          this.includesPastTickets = val;

        },
        error: (err) => {
          console.error(err);
        }
        });
    }


  }

  public refund() : void {
    if(!this.orders){
      return;
    }
    this.refundInProgress = true;
    this.refundText = this.refundLoadingText;


    this.orderService.refundOrder(this.orders.id, this.orders.service).subscribe({
      next: () => {
        localStorage.setItem('refund','success');
        this.refundInProgress = false;
        this.refundText = this.refundPrompt;
        this.showPopup = false;


        // Refreshing the page
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        });
    },
      error: (err) => {
        console.error(err);
        this.refundError = true;
        this.refundErrorMessage += err;
        this.errorMessage = this.refundErrorMessage;
        this.refundInProgress = false;

      }
    });

  }

  public refundSafety() : void {
      this.showPopup = true;
  }
  public cancel():void{
    this.showPopup = false;
  }

  public noRefund():void{
    this.showNoRefund = true;

  }
  public close():void{
    this.showNoRefund = false;
  }

  public toggleDetails() : void {
    if(!this.showDetails){
      this.showDetails = true;
    }
    else{
      this.showDetails = false;
    }
  }

}
