import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';
import { ChangePersonalInfoService } from 'src/app/services/change-personal-info.service';
import { PageStatusService } from 'src/app/services/page-status.service';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

  public user?: User;
  public showPopup = false;

  constructor(private router: Router, private loginService: LoginService, private changePersonalInfoService: ChangePersonalInfoService, private pageStatus: PageStatusService){}

  ngOnInit() : void {
    this.loginService.getUser().subscribe({
      next: (val:User) => {
        this.user = val;
      },
      error: (err:User) => {
        this.user = {
          id: -1,
          firstname: 'error',
          lastname: 'error',
          street: 'error',
          number: 'error',
          postalcode: 'error',
          place: 'error',
          email: 'error',
          password: 'error'
        };
        console.error('User not found:'+err);
      }
    });
  }


  logout(): void {
    this.loginService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  changePageToName():void{
    this.router.navigateByUrl('/profile/edit-Name');
    this.pageStatus.hideNavigationBar();
  }

  changePageToAdresse():void{
    this.router.navigateByUrl('/profile/edit-Adresse');
    this.pageStatus.hideNavigationBar();
  }

  changePageToPassword():void{
    this.router.navigateByUrl('/profile/edit-Password');
    this.pageStatus.hideNavigationBar();
  }

  orders() : void {
    this.router.navigateByUrl('profile/bestellungen');
  }

  openPopup(): void {
    this.showPopup= true;
  }

  closePopup(): void {
    this.showPopup= false;
  }

  deleteProfile(): void {
    this.showPopup= false;
    this.router.navigateByUrl('/profile/delete');
  }

}
