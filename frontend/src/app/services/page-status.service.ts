import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PageStatusService {

  constructor(private router: Router) { }

  public showBar = true;

  setNavigationBar():void{
    this.showBar = true;
  }

  hideNavigationBar():void{
    this.showBar = false;
  }

  showNavigationBar():boolean{
    return this.showBar;
  }


  refreshView():void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


}
