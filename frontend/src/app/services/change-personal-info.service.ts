import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseMessage } from '../models/messages';
import { Observable, pipe, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangePersonalInfoService {

  constructor(private http: HttpClient) { }
  /**
   * The Service take a existing user with changed data and update the user in the database
   * @param email - used to indentify a user
   *
   * //optional parameters, only changed if defined
   * @param firstname
   * @param lastname
   * @param street
   * @param number
   * @param postalcode
   * @param place
   * @param password - clear password if changed, Hash otherwise
   * @returns ResponseMessage{Message: string, status: number, html-code}
   */
  public changePersonalInfo(firstname?: string, lastname?: string, street?:string, number?:string,postalcode?:string, place?:string, email?: string,  password?: string):Observable<ResponseMessage>{
    const registerObservable = this.http.put<ResponseMessage>('/api/change-user', {
      firstname: firstname,
      lastname: lastname,
      street: street,
      number: number,
      postalcode: postalcode,
      place:place,
      email: email,
      password: password,
    });pipe(shareReplay());
    return registerObservable;
  }
}

