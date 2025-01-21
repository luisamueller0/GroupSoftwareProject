import { Injectable } from '@angular/core';
import { DownloadService } from './download.service';
import { HttpClient } from '@angular/common/http';
import { DownloadMessage } from '../models/downloadMessage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(private downloadService : DownloadService, private http: HttpClient) { }



  public downloadTicket(event_id: number) : void {

    const downloadObservable : Observable<DownloadMessage> =  this.http.post<DownloadMessage>('/api/print-ticket', {event_id: event_id});
    downloadObservable.subscribe({
      next: (val: DownloadMessage) => {
          const fileName = 'http://localhost:80/' + val.filename;
          DownloadService.downloadFile(this.downloadService, fileName);

          // Delete the Ticket from the server
          this.http.delete('/api/delete-ticketfile', {body: {filename: val.filename}, responseType: 'text'}).subscribe({
                  next: () => {
                    return;
                  },
                  error: (err: Error) => {
                    console.error(err);
                  }
          });
      } 
      ,
      error: (err) => {
        console.error(err);
        alert(err.error.message);
        return;
      }
    });

  }
  


}
