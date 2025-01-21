import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { shareReplay } from 'rxjs';
import { User } from 'src/app/models/user';
import { ResponseMessage } from 'src/app/models/messages';
import { validateIsPassword } from 'src/app/models/validation';
import { ChangePersonalInfoService } from 'src/app/services/change-personal-info.service';
import { PageStatusService } from 'src/app/services/page-status.service';


@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css']
})
export class EditPasswordComponent implements OnInit {

  public passwordOld = '';
  public password = '';
  public passwordCheck = '';
  public errorMessage = '';
  public successMessage = '';
  public bools: boolean[] =  new Array(3).fill(true);//alle Eingaben per default richtig
  public user?: User;
  public msgs =['','Stimmt nicht mit neuem Passwort überein', 'Muss mindestens 8 Zeichen lang sein'];

  constructor(private loginService: LoginService, private router: Router, private http: HttpClient, private changePersonalInfoService: ChangePersonalInfoService, private pageStatus: PageStatusService){}

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
  
  public check(): void {
    this.checkInput()
      .then(() => {
        const isValid = this.bools.every((bool) => bool);
        if (!isValid) {
          if (this.bools[0]) {
            this.errorMessage = 'Korrigieren Sie die markierten Eingaben';
          }
        } else {
          this.save();
          this.errorMessage = '';
          this.successMessage = 'Aktualisierung erfolgreich!';
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  public async checkInput(): Promise<void> {
    this.errorMessage = ''; // Reset error message
    let isOldPasswordValid = true; // Flag to track old password validation

    const inputArray = [this.passwordOld, this.password, this.passwordCheck];
    const passwordComp = this.password === this.passwordCheck;

    const validationFunctions = [
      async (input: string): Promise<boolean> => {
        try {
          await this.validatePassword(input);
          return true;
        } catch (error) {
          return false;
        }
      },
      (input: string): boolean => validateIsPassword(input),
      (): boolean => passwordComp,
    ];

    const errorMessages = [
      'Falsches Passwort',
      'Muss mindestens 8 Zeichen lang sein',
      'Stimmt nicht mit Passwort überein',
    ];

    for (let i = 0; i < inputArray.length; i++) {
      this.msgs[i] = '';
      const input = inputArray[i].trim();
      this.bools[i] = input !== '' && (await validationFunctions[i](input));
      if (!this.bools[i]) {
        this.msgs[i] = input === '' ? 'Pflichtfeld' : errorMessages[i];
      }

      if (i === 0 && !this.bools[i]) {
        isOldPasswordValid = false; // Old password validation failed
      }
    }

    const isValid = this.bools.every((bool) => bool);
    if (!isValid) {
      if (!isOldPasswordValid && (this.bools[1] && this.bools[2])) {
        this.errorMessage = 'Falsches aktuelles Passwort. Erneut eingeben.';
      } else {
        this.errorMessage = 'Korrigieren Sie die markierten Eingaben';
      }
    } else {
      this.save();
      this.errorMessage = '';
      this.successMessage = 'Aktualisierung erfolgreich!';
    }
  }

  public validatePassword(password: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.post<ResponseMessage>('/api/validate-pw', {
        email: this.user?.email,
        password: password,
      })
      .pipe(shareReplay())
      .subscribe(
        () => resolve(),
        () => reject()
      );
    });
  }

  public save():void{
    this.changePersonalInfoService.changePersonalInfo(this.user?.firstname, this.user?.lastname, this.user?.street, this.user?.number,
      this.user?.postalcode, this.user?.place, this.user?.email, this.password)
      //an backend das neue Passwort schicken
      .subscribe(() => {
        // Daten wurden geändert, navigate zu Profil
        this.pageStatus.setNavigationBar();
        this.router.navigateByUrl('/profile');
      });
  }

  public cancel():void{
    this.pageStatus.setNavigationBar();
    this.router.navigateByUrl('/profile');
  }

}
