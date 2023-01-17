import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http"
import { EmailValidator } from '@angular/forms';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  signUpService(email:string, password:string, password1:string) {
    console.log(email)
    console.log(password)
    console.log(password1)
    return this.http.post("http://127.0.0.1:8000/account/api-vi/signup/", {
      email: email,
      password: password, 
      password1: password1
    }).pipe(
      catchError(this.handleError)
    )
  }
  private handleError(errorRes:HttpErrorResponse){
    let errorMessage = 'an unknown error occurred while signing up'
    if (!errorRes.error){
      return throwError(errorMessage)
    }
    if(errorRes.error.email){errorMessage=errorRes.error.email}
    if(errorRes.error['non_field_errors']){errorMessage=errorRes.error['non_field_errors']}
    console.log(errorRes.error['non_field_errors'])
    return throwError(errorMessage)
  }
}
