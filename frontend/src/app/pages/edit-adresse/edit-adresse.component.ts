import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';
import { validateIsCityName, validateIsOnlyNumbers, validateIsPostalcode, validateStreet, validateStreetNumber } from 'src/app/models/validation';
import { ChangePersonalInfoService } from 'src/app/services/change-personal-info.service';
import { PageStatusService } from 'src/app/services/page-status.service';


@Component({
  selector: 'app-edit-adresse',
  templateUrl: './edit-adresse.component.html',
  styleUrls: ['./edit-adresse.component.css']
})
export class EditAdresseComponent implements OnInit {

  public user?: User;
  public street = '';
  public number = '';
  public postalcode = '';
  public place = '';
  public msgs: String[] =new Array(4).fill('');
  public errorMessage = '';
  public successMessage = '';

  public bools: boolean[] = new Array(4).fill(true);

  constructor(private router: Router,
    private loginService: LoginService,
    private changePersonalInfoService: ChangePersonalInfoService,
    private pageStatus: PageStatusService) {}

  checkUndefined(value: string | undefined): string {    //filtert undefined raus
    if (typeof value === 'undefined') {
      return '';
    }
    return value;
  }
  ngOnInit(): void {
    this.loginService.getUser().subscribe({
      next: (val: User) => {
        this.user = val;
        this.street = this.checkUndefined(this.user?.street);
        this.number = this.checkUndefined(this.user?.number);
        this.postalcode = this.checkUndefined(this.user?.postalcode);
        this.place = this.checkUndefined(this.user?.place);
      },
      error: (err: User) => {
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
        console.error('User not found:' + err);
      }
    });
  }
  checkInput(): void {
    this.errorMessage = ''; // Reset error message

    const validationFunctions = [
      validateStreet,
      validateStreetNumber,
      (input: string):boolean => input !== '' && validateIsOnlyNumbers(input) && validateIsPostalcode(input),
      validateIsCityName,
    ];

    const errorMessages = [
      'Ungültiger Straßenname',
      'Mindestens eine Zahl',
      'Muss fünfstellige Zahl sein',
      'Ungültiger Stadtname',
    ];

    for (let i = 0; i < validationFunctions.length; i++) {
      const input = [this.street, this.number, this.postalcode, this.place][i].trim();
      this.msgs[i] = '';
      this.bools[i] = input !== '' && validationFunctions[i](input);
      if (!this.bools[i]) {
        this.msgs[i] = input === '' ? 'Pflichtfeld' : errorMessages[i];
      }
    }

    const isValid = this.bools.every((bool) => bool);
    if (!isValid) {
      this.errorMessage = 'Korrigieren Sie die markierten Eingaben';
    } else {
      this.errorMessage = '';
      this.successMessage = 'Aktualisierung erfolgreich!';
      this.save();
    }
  }

  save(): void {
    this.changePersonalInfoService.changePersonalInfo(
      this.user?.firstname,
      this.user?.lastname,
      this.street,
      this.number,
      this.postalcode,
      this.place,
      this.user?.email,
      undefined)
    //an backend den neuen Vor un Nachnamen schicken
    .subscribe(() => {
      // Daten wurden geändert, navigate zu Profil
      this.pageStatus.setNavigationBar();
      this.router.navigateByUrl('/profile');
    });
  }

  cancel(): void {
    this.pageStatus.setNavigationBar();
    this.router.navigateByUrl('/profile');
  }
}
