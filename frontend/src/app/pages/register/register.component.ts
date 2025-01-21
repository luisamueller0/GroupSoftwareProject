import { Component} from '@angular/core';
import { RegisterService } from 'src/app/services/register.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { validateIsOnlyLetters, validateIsCityName,validateIsEmail,validateIsPassword, validateIsOnlyNumbers,validateIsPostalcode, validateStreet, validateStreetNumber} from 'src/app/models/validation';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public forename = '';
  public surname = '';
  public street = '';
  public number = '';
  public postalcode = '';
  public place = '';
  public email = '';
  public password = '';
  public passwordTest = '';
  public errorMessage = ''; //Hinweis, der in html angezeigt wird
  public input = new Array(9).fill(''); //used to iterate through inputs
  public passwordComp = true;
  public bools: boolean[] =  new Array(9).fill(true);//alle Eingaben per default richtig
  public msgs: String[] =new Array(9).fill(''); //alle messages per default leer
  constructor(private router: Router, private registerService: RegisterService, private loginService: LoginService) {}

  checkInput(): void {
    this.errorMessage = ''; // Reset error message

    const inputs = [
      this.forename, this.surname, this.street, this.number,
      this.postalcode, this.place, this.email.toLowerCase(), this.password, this.passwordTest
    ];

    const validations = [
      validateIsOnlyLetters, validateIsOnlyLetters, validateStreet,
      validateStreetNumber, (input: string):boolean => validateIsOnlyNumbers(input) && validateIsPostalcode(input),
      validateIsCityName, validateIsEmail, validateIsPassword, (input: string):boolean => input === this.password
    ];

    const errorMessages = [
      'Darf nur Buchstaben enthalten', 'Darf nur Buchstaben enthalten', 'Ungültiger Straßenname',
      'Mindestens eine Zahl', 'Muss fünfstellige Zahl sein', 'Ungültiger Stadtname',
      'Entspricht nicht Email-Adressen Format', 'Muss mindestens 8 Zeichen lang sein', 'Stimmt nicht mit Passwort überein'
    ];

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i].trim();
      this.msgs[i] = '';
      this.bools[i] = input !== '' && validations[i](input);
      if (!this.bools[i]) {
        this.msgs[i] = input === '' ? 'Pflichtfeld' : errorMessages[i];
      }
    }

    this.passwordComp = this.password === this.passwordTest;

    if (!this.passwordComp) {
      this.msgs[8] = 'Stimmt nicht mit Passwort überein';
      this.bools[8] = false;
    }

    if (!this.bools.every((bool) => bool)) {
      this.errorMessage = 'Korrigieren Sie die markierten Eingaben';
    }
  }

  register(): void {
    this.checkInput(); // Call the checkInput function to perform validations

    if (!this.bools.every((bool) => bool)) {
      this.errorMessage = 'Korrigieren Sie die markierten Eingaben';
    } else {
      this.errorMessage = '';
      this.registerService.register(
        this.forename, this.surname, this.street, this.number,
        this.postalcode, this.place, this.email.toLowerCase(), this.password
      ).subscribe({
        next: () => {
          // Registration success, proceed with login
          this.loginService.login(this.email.toLowerCase(), this.password).subscribe({
            next: () => {
              // Successful login, navigate to the map page
              this.router.navigateByUrl('/map');
            },
            error: (err) => {
              this.errorMessage = 'Automatisches Login hat nicht funktioniert. Probieren Sie sich manuell anzumelden.';
              console.error(err);
            }
          });
        },
        error: (err) => {
          if (err.status === 400) {
            // Email address already used
            localStorage.setItem('email', this.email);
            this.bools[6] = false;
            this.msgs[6] = 'Bereits genutzt';
            this.errorMessage = 'Die E-Mail-Adresse wurde bereits benutzt. <br> Benutzen Sie eine andere E-Mail-Adresse oder <a href="/login"> melden Sie sich an. </b>';
          } else {
            this.errorMessage = 'Die Registrierung ist fehlgeschlagen. Versuchen Sie es erneut.';
          }
        }
      });
    }
  }


}

