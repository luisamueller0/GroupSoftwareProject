import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangePersonalInfoService } from 'src/app/services/change-personal-info.service';
import { PageStatusService } from 'src/app/services/page-status.service';

@Component({
  selector: 'app-bezahlen',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class BezahlenComponent {

  constructor(private router: Router, private changePersonalInfoService: ChangePersonalInfoService, private pageStatus: PageStatusService){}
  
  public singleOrder = (localStorage.getItem('order') as string) === 'singleOrder'? true : false;   // if its an order for a single event, the page will show infos about the event

  public eventName = localStorage.getItem('eventName') as string;
  public eventDate = localStorage.getItem('eventDate') as string;
  public eventID = parseInt(localStorage.getItem('eventId') as string);
  public ticketPrice = localStorage.getItem('ticketPrice') as string;

  // Different tickets
  public ticketAmount = localStorage.getItem('normalAmount') as string;
  public childAmount = localStorage.getItem('childAmount') as string;
  public seniorAmount = localStorage.getItem('seniorAmount') as string;
  public studentAmount = localStorage.getItem('studentAmount') as string;

  public hasSpecialTickets = this.childAmount + this.seniorAmount + this.studentAmount !== '000';

  payment(service: string) : void {
    switch(service){
      case 'swpsafe':
        this.router.navigateByUrl('/payment/SWPsafe');
        break;
      case 'hcipal':
        this.router.navigateByUrl('/payment/HCIpal');
        break;
      case 'bachelorcard':
        this.router.navigateByUrl('/payment/Bachelorcard');
        break;
    }

    this.pageStatus.hideNavigationBar();

  }

}
