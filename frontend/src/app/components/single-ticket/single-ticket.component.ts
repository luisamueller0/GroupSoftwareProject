import { Component, Input, OnInit } from '@angular/core';
import { TicketGroup } from 'src/app/models/ticket';
import { EvaluationService } from 'src/app/services/evaluation.service';
import { EventService } from 'src/app/services/event.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-single-ticket',
  templateUrl: './single-ticket.component.html',
  styleUrls: ['./single-ticket.component.css']
})
export class SingleTicketComponent implements OnInit{

  @Input() tickets?:TicketGroup;
  @Input() oldTickets?:TicketGroup;

  public datesAreEqual = false;
  public oldDatesAreEqual = false;
  public eventIsOver = false;
  public isOldEvent = false;

  public buttonHeight= 0;

  public isBewertenVisible = false;

  public canEvaluate = false;
  public hasEvaluated = false;

  public download = false;


  constructor(private eventService: EventService,
    private printSercive: PrintService,
    private evaluationService : EvaluationService){}


  ngOnInit(): void {
    if(this.tickets){
       this.tickets = {
      title :this.eventService.cutoffAfterOpeningBracket(this.tickets.title),
      event_id: this.tickets.event_id,
      start_date: this.eventService.convertDate(this.tickets.start_date) ,
      end_date: this.eventService.convertDate(this.tickets.end_date) ,
      picture:  '/img/events/' + this.tickets.picture,
      number: this.tickets.number
      };

      if(this.tickets.start_date === this.tickets.end_date){
        this.datesAreEqual = true;
      }
    }

    if(this.oldTickets){
      this.oldTickets = {
        title :this.eventService.cutoffAfterOpeningBracket(this.oldTickets.title),
        event_id: this.oldTickets.event_id,
        start_date: this.eventService.convertDate(this.oldTickets.start_date) ,
        end_date: this.eventService.convertDate(this.oldTickets.end_date) ,
        picture:  '/img/events/' + this.oldTickets.picture,
        number: this.oldTickets.number
      };
      if(this.oldTickets.start_date === this.oldTickets.end_date){
        this.oldDatesAreEqual = true;
      }

      this.evaluationService.canEvaluate(this.oldTickets.event_id).subscribe({
        next: (val) => this.canEvaluate = val,
        error: (err) => console.error(err)
      });
      this.evaluationService.hasntEvaluated(this.oldTickets.event_id).subscribe({
        next: (val) => this.hasEvaluated = !val,
        error: (err) => console.error(err)
      });

      this.isOldEvent = true;
    }

  }

  public downloadTicket() : void {
    if(this.tickets){
      this.printSercive.downloadTicket(this.tickets?.event_id);
      this.download = true;
      setTimeout(() => { //nach 2 Sekunden cancel
        this.download = false;
      },4000);
    }
  }

  public evaluate(event: MouseEvent):void{
    this.isBewertenVisible = !this.isBewertenVisible;
    event.stopPropagation();
  }

}
