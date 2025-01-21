import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private http: HttpClient) { }

  public getBlobObs(url: string) : Observable<Blob>{          // Blob = raw data
      return this.http.get(url, {responseType: 'blob'});
  }

  public static downloadFile(d : DownloadService, url: string) : void {
      d.getBlobObs(url)
      .subscribe({
        next: (file) => {
          // we simulate an <a> element, which would download the file 
          const a = document.createElement('a');
          const objectURL = URL.createObjectURL(file);
          const fSplit = url.split('/');
          const fileName = fSplit[fSplit.length - 1];

          a.href = objectURL;
          a.download = fileName;

          // then we simulate clicking on the element
          a.click();
          URL.revokeObjectURL(objectURL);   // at the end our blob is discarded by revoking the objectURL
        },
        error: (err) => {
          console.error('Error downloading a file from ' + url);
          console.error(err);
        }
      });
  }

}
