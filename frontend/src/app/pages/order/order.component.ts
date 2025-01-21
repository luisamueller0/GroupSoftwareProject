import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent {

  public singleOrder = (localStorage.getItem('order') as string) === 'singleOrder'? true : false;     // checks whether this page either does a single order or adds tickets for one event to the "Warenkorb"

  constructor(private router : Router,
    private cartService : CartService){}

  private max_amount = 99;

  public eventName = localStorage.getItem('eventName') as string;
  public eventDate = localStorage.getItem('eventDate') as string;
  public ticketAmount = localStorage.getItem('ticketAmount') as string;
  public eventID = parseInt(localStorage.getItem('eventId') as string);

  public price_normal = localStorage.getItem('price_normal') as string;
  public price_child = localStorage.getItem('price_child') as string;
  public price_senior = localStorage.getItem('price_senior') as string;
  public price_student = localStorage.getItem('price_student') as string;

  public normalAmount = 0;
  public childAmount = 0;
  public seniorAmount = 0;
  public studentAmount = 0;
  public total = '0.00';

  public currentlyOpen = 'none';

  private priceToNr = (price : string) : number => {
    if(!price){
      return 0;
    }

    price = price.slice(0,price.length - 1);
    price = price.replace(',', '.');
    return Number(price);
  };



  public changeAmount(increase : boolean, type : string, event : MouseEvent) : void {
    event.stopPropagation();

    const change = (amount: number) : number => {
        increase? amount++ : amount--;
        amount < 0? amount = 0 : amount = amount;
        amount > this.max_amount? amount = this.max_amount : amount = amount;
        return amount;
    };

    switch(type){
      case 'normal':
        this.normalAmount = change(this.normalAmount);
        break;
      case 'child':
        this.childAmount = change(this.childAmount);
        break;
      case 'senior':
        this.seniorAmount = change(this.seniorAmount);
        break;
      case 'student':
        this.studentAmount = change(this.studentAmount);
        break;
      default:
        // return;
    }


    // Recalculate total costs
    let totalNr = (this.normalAmount * this.priceToNr(this.price_normal) + this.childAmount * this.priceToNr(this.price_child)
                      + this.seniorAmount * (this.priceToNr(this.price_senior)) + this.studentAmount * this.priceToNr(this.price_student));
    totalNr = Math.round(totalNr * 100) / 100; //round to 2 digits

    this.total = totalNr.toString();

    const digitSplit = this.total.split('.');
    if(digitSplit.length > 1){
      const amountOfDigits = digitSplit[1].length;
      if (amountOfDigits < 2){    // if the string has less than two digits after the decimal point
        amountOfDigits === 1? this.total += '0' : this.total += '0';

      }
    }
    else{
      this.total += '.00';
    }

  }

  public buy():void{
    localStorage.setItem('ticketPrice', this.total + '€');

    localStorage.setItem('normalAmount', this.normalAmount.toString());
    localStorage.setItem('childAmount', this.childAmount.toString());
    localStorage.setItem('seniorAmount', this.seniorAmount.toString());
    localStorage.setItem('studentAmount', this.studentAmount.toString());

    localStorage.setItem('buyWarenkorb', 'false');

    this.router.navigateByUrl('/payment');

  }

  public shoppingCart():void{

    if((this.normalAmount + this.childAmount + this.seniorAmount + this.studentAmount) !== 0){

      this.cartService.addToCart(this.eventID, this.normalAmount, this.childAmount, this.seniorAmount, this.studentAmount, parseInt(this.total)).subscribe({
        next: () => {
          this.router.navigateByUrl('/shoppingCart');
        },
        error: (err) => {
          console.error(err);
        }
      });


    }else{
      console.error('Error in adding ticket to shopping cart: Tried to add 0 tickets to cart');
    }



  }
  // Opens a singular Pop-Up Info Box and closes the last one if one is already open
  public openThisInfo(id : string):void {
    if(this.currentlyOpen === 'none'){
      const popup = document.getElementById(id);
      popup?.classList.toggle('show');
      this.currentlyOpen = id;
    }
    else if(this.currentlyOpen === id){
      const popup = document.getElementById(this.currentlyOpen);
      popup?.classList.toggle('show');
      this.currentlyOpen = 'none';
    }
    else{
      const popup = document.getElementById(this.currentlyOpen);
      popup?.classList.toggle('show');
      const popup1 = document.getElementById(id);
      popup1?.classList.toggle('show');
      this.currentlyOpen = id;
    }

  }
}
