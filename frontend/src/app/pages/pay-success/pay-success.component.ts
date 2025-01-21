import { Component } from '@angular/core';
import { Router } from '@angular/router';

export interface image {
  icon: string;
}

@Component({
  selector: 'app-pay-success',
  templateUrl: './pay-success.component.html',
  styleUrls: ['./pay-success.component.css']
})
export class PaySuccessComponent {
  constructor(private router: Router){}
  public entry: image = {icon: 'local_activity'};

  /**
   * Both of these Events still need to be finalized.
   * otherEvents() should lead to the Event list.
   * toTicket() should lead to a list of Tickets the User has bought.
   */
  otherEvents(): void{
    this.router.navigateByUrl('/events');
  }
  toTicket(): void{
    this.router.navigateByUrl('/tickets');
  }
}
