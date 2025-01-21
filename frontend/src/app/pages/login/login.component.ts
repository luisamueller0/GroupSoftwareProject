import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { validateIsEmail } from 'src/app/models/validation';
import { LoginService } from 'src/app/services/login.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  public email = localStorage.getItem('email') === null ? '' : localStorage.getItem('email') as string;
  public password = '';
  public errorMessage = '';
  public justdeleted = false;
  public bools: boolean[] =  new Array(2).fill(true);//alle Eingaben per default richtig
  public msgs: String[] =new Array(2).fill(''); //alle messages per default leer

  constructor(private router: Router,
    private loginService: LoginService) {}

  ngOnInit(): void {
    /* message for deleted profile should only be seen after user got directed to login after deleting it,
    afterwards message is not shown anymore*/
    if(localStorage.getItem('deleted') !== null){
      this.justdeleted = true;
      localStorage.removeItem('deleted');
    }
    else{
      this.justdeleted = false;
    }
  }

  public login(): void {
    this.justdeleted = false;
    this.errorMessage = ''; //reset of the error message
    const inputArray = [this.email,this.password];
    for (let i = 0; i < inputArray.length; i++) {
      this.bools[i] = true;
      this.msgs[i] = '';
      const input = inputArray[i];
      if(input === ''){
        this.bools[i] = false;
        this.msgs[i] = 'Pflichtfeld';
        this.errorMessage = 'Korrigieren Sie Ihre Eingaben.';
      }else{
        if(i === 0){
        this.bools[i] = validateIsEmail(input);
        if(!this.bools[i]){
          this.msgs[i] = 'Entspricht nicht Email-Adressen Format';
          this.errorMessage = 'Korrigieren Sie Ihre Eingaben.';
        }}
        else if(this.bools[0] = true){
          this.loginService.login(this.email.toLowerCase(), this.password).subscribe({
            next: () => {
              this.errorMessage = ' ';
              localStorage.removeItem('email');
              this.router.navigateByUrl('/map');          //bei erfolgreicher Anmeldung kann auf /map navigiert werden, da diese Seite nun freigeschaltet ist (loginGuard = true)
            },
            error: (err) => {
              this.bools[0] = false;
              this.bools[1] = false;
              this.errorMessage = err.error.message;
                console.error(err);
            }
          });
        }
      }
    }
  }

  public clearEmail(): void {                // used to remove the pre-selected email
    localStorage.removeItem('email');
  }
}
