import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ResponseMessage } from '../models/messages';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})

export class RegisterService {

  constructor(private http: HttpClient, private loginService: LoginService) { }
  public register(firstname: string, lastname: string, street:string, number:string,postalcode:string, place:string, email: string, password: string):Observable<ResponseMessage>{
    const registerObservable = this.http.post<ResponseMessage>('/api/register', {
      firstname: firstname,
      lastname: lastname,
      street: street,
      number: number,
      postalcode: postalcode,
      place:place,
      email: email,
      password: password
    }).pipe(shareReplay());
    return registerObservable;
  }
}
