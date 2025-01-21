import { Component, Input, OnInit} from '@angular/core';
import { orderTicket } from 'src/app/models/orderTicket';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-single-order-ticket',
  templateUrl: './single-order-ticket.component.html',
  styleUrls: ['./single-order-ticket.component.css']
})
export class SingleOrderTicketComponent implements OnInit {

  @Input() orderTicket?:orderTicket; // kommt von orders.component.html

  constructor(private eventService: EventService){}
  public normalAmount = 0;
  public childAmount = 0;
  public seniorAmount = 0;
  public studentAmount = 0;
  public noNormalAmount = true;
  public noChildAmount = true;
  public noSeniorAmount = true;
  public noStudentAmount = true;
  public startDate = '';
  public endDate = '';
  public sameDate = false;


  ngOnInit(): void {
    if(this.orderTicket){
      this.normalAmount = Number(this.orderTicket.normal_tickets);
      this.seniorAmount = Number(this.orderTicket.senior_tickets);
      this.studentAmount = Number(this.orderTicket.student_tickets);
      this.childAmount = Number(this.orderTicket.child_tickets);
      this.orderTicket.title = this.eventService.cutoffAfterOpeningBracket(this.orderTicket.title);
      this.startDate = this.eventService.convertDate(this.orderTicket.start_date);
      this.endDate = this.eventService.convertDate(this.orderTicket.end_date);
      this.sameDate = this.startDate === this.endDate;

      this.noNormalAmount = this.normalAmount === 0;
      this.noSeniorAmount = this.seniorAmount === 0;
      this.noChildAmount = this.childAmount === 0;
      this.noStudentAmount = this.studentAmount === 0;
    }
  }
}
