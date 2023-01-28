import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http"
import {  BehaviorSubject, throwError } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { LoginModel } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { 
    let refresh_token = localStorage.getItem('refresh_token');
    let access_token = localStorage.getItem('access_token');
    this.userIsLoggedIn.next(!!refresh_token);
   }

  loginResponseData = new BehaviorSubject<LoginModel>(null!)
  userIsLoggedIn = new BehaviorSubject<boolean>(false)
  logoutResponseData =new BehaviorSubject<string>('')

  signUpService(email:string, password:string, password1:string) {
    return this.http.post("http://127.0.0.1:8000/account/api-vi/signup/", {
      email: email,
      password: password, 
      password1: password1
    }).pipe(
      catchError(this.handleError)
    )
  }

  logInService(email:string, password:string){
    return this.http.post("http://127.0.0.1:8000/account/api-vi/signin/", {
      email: email,
      password: password
  }).pipe(

    catchError(this.handleError),

    tap((resData:any) => {
      const loginResponse = new LoginModel(resData.refresh, 
        resData.access , 
        resData.email, 
        +resData.refresh_exp, 
        +resData.access_exp )
      localStorage.setItem('refresh_token', resData.refresh)
      localStorage.setItem('access_token', resData.access)

      this.loginResponseData.next(loginResponse)
      this.userIsLoggedIn.next(true)
    })

  )
}
  
  logOut(refresh:any) {
    return this.http.post("http://127.0.0.1:8000/account/api-vi/logout/",{refresh}).pipe(
      tap( (data:any) => {
        this.userIsLoggedIn.next(false)
        this.logoutResponseData.next(data.detail)
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('access_token')
    }),
  )}
  
  private handleError(errorRes:HttpErrorResponse){
    let errorMessage = 'an unknown error occurred while signing up'
    if (!errorRes.error){
      return throwError(errorMessage)
    }
    if(errorRes.error.email){
      errorMessage=errorRes.error['email']
    }
    if(errorRes.error['password']){
      errorMessage=errorRes.error['password']
    }
    if (errorRes.error['password1']){
      errorMessage=errorRes.error['password1']
    }
    return throwError(errorMessage)
  }
}
