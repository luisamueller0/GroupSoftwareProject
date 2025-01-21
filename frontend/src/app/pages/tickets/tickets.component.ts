import { Component, OnInit } from '@angular/core';
import { TicketGroup} from 'src/app/models/ticket';
import { DownloadService } from 'src/app/services/download.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  constructor(private ticketService: TicketService, private downloadService: DownloadService){}

  public allTickets : TicketGroup[] = [];
  public pastTickets: TicketGroup[] = [];
  public showOldTickets = true;
  public noTickets = false;


ngOnInit() : void {
  this.ticketService.getTickets().subscribe({
    next: (val:TicketGroup[]) => {
      this.allTickets = val;
      this.noTickets = (this.allTickets.length === 0) && (this.pastTickets.length === 0);
      
    },
    error: (err: TicketGroup[]) => {
      this.allTickets = [{
        picture: 'error',
        event_id: -1,
        title: 'error',
        number: 'error',
        start_date: 'error',
        end_date: 'error',
      }];
      console.error('Tickets not found:'+err);
    }
  });

  this.ticketService.getPastTickets().subscribe({
    next: (val:TicketGroup[]) => {
      this.pastTickets = val;
      this.noTickets = (this.allTickets.length === 0) && (this.pastTickets.length === 0);
      if(this.pastTickets.length === 0){
        this.showOldTickets = false;
      }
    },
    error: (err: TicketGroup[]) => {
      this.pastTickets = [{
        picture: 'error',
        event_id: -1,
        title: 'error',
        number: 'error',
        start_date: 'error',
        end_date: 'error',
      }];
      console.error('Tickets not found:'+err);
    }
  });

}


  public vergangeneTickets = [
  {
    'picture': '/orchideenschau-2018.jpg',
    'title': 'test1',
    'event_id': 1,
    'number': '2',
    'start_date': '2023-03-03',
    'end_date': '2023-10-22'
  },
  {
    'picture': '/orchideenschau-2018.jpg',
    'event_id': 1,
    'title': 'test2',
    'number': '2',
    'start_date': '2023-03-03',
    'end_date': '2023-03-03'
  },
  {
    'picture': '/orchideenschau-2018.jpg',
    'event_id': 1,
    'title': 'test3',
    'number': '2',
    'start_date': '2023-07-03',
    'end_date': '2023-10-22'
  }
  ];

}
