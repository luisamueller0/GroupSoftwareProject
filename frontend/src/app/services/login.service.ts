import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ResponseMessage } from '../models/messages';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public loggedIn = false;
  public authChecked = false;

  constructor(private http: HttpClient) { }

  public setLoggedIn(): void{
    this.loggedIn= true;
  }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }


  public checkAuth(): Observable<boolean> {
    const authObservable: Observable<boolean> = this.http.get<boolean>('/api/auth').pipe(shareReplay());
    authObservable.subscribe({
      next: (val) => {
        this.loggedIn = val;
        this.authChecked = true;
      },
      error: (err) => {
        this.loggedIn = false;
        console.error(err);
      }
    });
    return authObservable;
  }



  public login(email: string, password: string): Observable<ResponseMessage> {          // password in Klartext
    const loginObservable = this.http.post<ResponseMessage>('/api/login' , {            // post Anfrage zum Server mit den email und password variablen aus den User Inputs
      email: email ,
      password: password
    }).pipe(shareReplay());            //pipe share replay, damit subscribe nur einmal ausgeführt wird
    loginObservable.subscribe({
        next: () => {
            this.loggedIn = true;     // erfolgreicher Zugriff setzt loggedIn auf true
        },
        error: () => {
            this.loggedIn = false;    // bei Fehlern bleibt loggedIn false
        }
    });
    return loginObservable;
  }

  public getUser():Observable<User>{
    const userOberservable = this.http.get<User>('/api/user-info',{}).pipe(shareReplay()); //no request
    return userOberservable;
  }



  public logout(): Observable<ResponseMessage>{
      const logoutObservable : Observable<ResponseMessage> = this.http.delete<ResponseMessage>('/api/logout').pipe(shareReplay());    //pipe(shareReplay()) = Only do the request one time instead of once for every subcribe()
      logoutObservable.subscribe({

        // Logout successful
        next: () => {
              this.loggedIn = false;
        },

        // Logout fails
        error: (err) => {
              this.checkAuth(); // In case the user is already logged out
              console.error(err);
        }


      });

      return logoutObservable;

    }

    public delete(): Observable<ResponseMessage>{
      const deleteObservable : Observable<ResponseMessage> = this.http.delete<ResponseMessage>('/api/delete-profile').pipe(shareReplay());
      deleteObservable.subscribe({
        // Delete successful
        next: () => {
              this.loggedIn = false;
        },
        // Delete fails
        error: (err) => {
              console.error(err);
        }
      });
      return deleteObservable;
    }



}
