import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { validateIsOnlyLetters } from 'src/app/models/validation';
import { LoginService } from 'src/app/services/login.service';
import { User } from 'src/app/models/user';
import { ChangePersonalInfoService } from 'src/app/services/change-personal-info.service';
import { PageStatusService } from 'src/app/services/page-status.service';

@Component({
  selector: 'app-edit-name',
  templateUrl: './edit-name.component.html',
  styleUrls: ['./edit-name.component.css']
})
export class EditNameComponent implements OnInit{

  constructor(private loginService: LoginService,
    private router: Router,
    private changePersonalInfoService: ChangePersonalInfoService,
    private pageStatus: PageStatusService){}

  public user?: User;
  public forename = '';
  public surname = '';

  public errorMessage = '';
  public bools: boolean[] =  new Array(2).fill(true);
  public msgs: String[] =new Array(2).fill('');
  public successMessage = '';


  checkUndefined(value: string | undefined): string{    //filtert undefined raus
    if(typeof value === 'undefined'){
      return '';
    }
    return value;
  }
    ngOnInit() : void {
      this.loginService.getUser().subscribe({
        next: (val:User) => {
          this.user = val;
          this.forename = this.checkUndefined(this.user?.firstname);
          this.surname = this.checkUndefined(this.user?.lastname);
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

  checkInput(): void {
    this.errorMessage = ''; // Reset error message
    const inputArray = [this.forename, this.surname];
    const errorMessages = ['Pflichtfeld', 'Darf nur Buchstaben enthalten'];

    for (let i = 0; i < inputArray.length; i++) {
      const input = inputArray[i].trim();
      this.msgs[i] = '';
      this.bools[i] = input !== '' && validateIsOnlyLetters(input);
      if (!this.bools[i]) {
        this.msgs[i] = input === '' ? errorMessages[0] : errorMessages[1];
      }
    }

    const isValid = this.bools.every((bool) => bool);
    if (!isValid) {
      this.errorMessage = 'Korrigieren Sie die markierten Eingaben';
    } else {
      this.save();
      this.errorMessage = '';
      this.successMessage = 'Aktualisierung erfolgreich!';
    }
  }


  save():void{
    this.changePersonalInfoService.changePersonalInfo(
      this.forename,
      this.surname,
      this.user?.street,
      this.user?.number,
      this.user?.postalcode,
      this.user?.place,
      this.user?.email,
      undefined)
      //an backend den neuen Vor un Nachnamen schicken
    .subscribe(() => {
      // Daten wurden geändert, navigate zu Profil
      this.pageStatus.setNavigationBar();
      this.router.navigateByUrl('/profile');
    });
  }

  cancel():void{
    this.pageStatus.setNavigationBar();
    this.router.navigateByUrl('/profile');

  }
}


