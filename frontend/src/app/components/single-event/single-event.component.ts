import { Component, Input, OnInit} from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Router } from '@angular/router';
import { Event } from 'src/app/models/events';


@Component({
  selector: 'app-single-event',
  templateUrl: './single-event.component.html',
  styleUrls: ['./single-event.component.css']
})
export class SingleEventComponent implements OnInit{

  @Input() events?:Event; // kommt von event.component.html

  public datesAreEqual = false;
  public inPast = false;


  constructor(private eventService: EventService,
    private router: Router){}

  ngOnInit(): void {
    if(this.events){
      this.events = {
      id : this.events.id,
      title : this.eventService.cutoffAfterOpeningBracket( this.events.title ),
      start_date: this.eventService.convertDate( this.events.start_date ),
      end_date: this.eventService.convertDate( this.events.end_date ),
      is_past: this.events.is_past,
      location: this.events.location,
      picture: '/img/events/' + this.events.picture,
      description: this.events.description,
      description_html: this.events.description_html,
      price: this.eventService.convertPriceFormat( this.events.price ),
      price_child: this.eventService.convertPriceFormat(this.events.price_child),
      price_senior: this.eventService.convertPriceFormat(this.events.price_senior),
      price_student: this.eventService.convertPriceFormat(this.events.price_student),
      eventLocation: this.events.eventLocation,
      };
      if(this.events.start_date === this.events.end_date){
        this.datesAreEqual = true;
      }
      this.inPast = this.events.is_past;
    }
  }

  public showEvent():void{
    this.router.navigateByUrl('/events/details?id=' + this.events?.id);
  }

  public showPastEvent():void{
    this.router.navigateByUrl('/events/details?id=' + this.events?.id);
  }
}
