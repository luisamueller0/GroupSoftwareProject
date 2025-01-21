
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { shareReplay } from 'rxjs';
import { User } from 'src/app/models/user';
import { ResponseMessage } from 'src/app/models/messages';
import { TicketGroup} from 'src/app/models/ticket';
import { TicketService } from 'src/app/services/ticket.service';


@Component({
  templateUrl: './delete-profile.component.html',
  styleUrls: ['./delete-profile.component.css']
})
export class DeleteProfileComponent implements OnInit{

  public password= '';
  public errorMessage = '';
  public successMessage = '';
  public count = 0; // zählt wie oft Passwort falsch eingegeben wurde, bricht nach 3. mal falsch eingeben ab
  public bool = true;//Passwort-Eingabe per default richtig
  public user?: User;
  public showTickets = false;
  public allTickets : TicketGroup[] = [];
  public showQuestion = false;
  //für Test



  constructor(private loginService: LoginService,
    private router: Router,
    private http: HttpClient,
    private ticketService: TicketService){}


  enter(): void {
    if(!this.showTickets && !this.showQuestion){
      this.checkInput();
    }
  }

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
        console.error('User not found:'+ err);
      }
    });
  }

  checkInput():void{

    this.errorMessage = '';
    this.successMessage = '';
    const filled = (this.password !== '');

    if(filled){

      //validate if password is correct
      const loginObservable = this.http.post<ResponseMessage>('/api/validate-pw' , {
        email: this.user?.email ,
        password: this.password
      }).pipe(shareReplay());
      loginObservable.subscribe({
          next: () => {
              this.bool = true;
              this.question();
          },
          error: () => {
              this.bool = false;
              this.count++;
        this.errorMessage = 'Passwort ist falsch. Sie haben noch ';
        switch (this.count) {
          case 1:
            this.errorMessage += 'zwei Versuche übrig.';
            break;
          case 2:
            this.errorMessage += 'einen Versuch übrig';
            break;
          case 3:
            this.errorMessage = 'Sie haben das Passwort drei mal falsch eingegeben. Sie werden zurück zum Profil geleitet.';
            this.count = 0;
            setTimeout(() => { //after 2 seconds cancel
              this.cancel();
            }, 2000);
            break;
          default:
          console.error('Failure while counting tries.'); //debug
            break;
        }
          }
      });
    }
    else{
      this.errorMessage = 'Geben sie ihr Passwort ein.';
      this.bool = false;
    }
  }

  question():void{
    this.ticketService.getTickets().subscribe({
      next: (val:TicketGroup[]) => {
        this.allTickets = val;
        if(this.allTickets.length === 0){
          this.showQuestion = true;
        }
        else{
          this.showTickets = true;
        }


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
        console.error('Tickets not found: '+err);
      }
    });

  }

  button():void{
    this.showQuestion = true;
    this.showTickets = false;
  }


  cancel():void{
    this.router.navigateByUrl('/profile');
  }

  delete():void{

    this.loginService.delete().subscribe({
    next: () => {
      localStorage.setItem('deleted','true');
      this.router.navigateByUrl('/login');
    },
    error: (err) => {
      console.error(err);
    }
    });
  }
}
