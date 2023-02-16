import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http"
import {  BehaviorSubject, throwError } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { LoginModel, SignUpModel } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginResponseData   = new BehaviorSubject<LoginModel>(null!)
  userIsLoggedIn      = new BehaviorSubject<boolean>(false)
  logoutResponseData  = new BehaviorSubject<string>('')
  needToRefreshToken  = new BehaviorSubject<boolean>(false)
  signUpMessage  = new BehaviorSubject<string>('')

  check_token_expire(token:string) {

    // JSON.parse convert string to json
    const jwt_data: any = JSON.parse( atob(token.split('.')[1]) )
    const now : number = Math.trunc( Date.now() / 1000 )

    if ( jwt_data.exp - now > 0 ){
      return true

    } else {
      return false

    }

  }

  sendNeedToRefreshMessage(access_token:any, refresh_token: any){

    if ( access_token){

      if (this.check_token_expire(access_token)){

        this.userIsLoggedIn.next(!!access_token)
        this.needToRefreshToken.next(false);

      } else {

        localStorage.removeItem('access_token')
        if (refresh_token){

          if (this.check_token_expire(refresh_token)){

            this.needToRefreshToken.next(true);
          }

        }

      }
  
    } else {

      //  here we need to refresh the access token if refresh token exists
      if (refresh_token){

        if (this.check_token_expire(refresh_token)){

          this.needToRefreshToken.next(true);
        }else{
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_email')
          this.needToRefreshToken.next(false);
        }
      }else{
        localStorage.removeItem('user_email')
      }
    }


  }



  constructor(private http:HttpClient ) {
    let refresh_token: string | null = localStorage.getItem('refresh_token')
    let access_token: any = localStorage.getItem('access_token');

    this.sendNeedToRefreshMessage(access_token, refresh_token)
   
  }


  renewAccessTokenService(refresh_token:string){
    return this.http.post('http://127.0.0.1:8000/account/api-vi/sign-in/refresh/',
     {
      refresh :refresh_token
    })
  }

  signUpService(email:string, password:string, password1:string) {
    return this.http.post("http://localhost:8000/account/api-vi/sign-up/", {
      email: email,
      password: password, 
      password1: password1
    }).pipe(
        catchError(this.handleError),
        tap( (data:any)=> {
          localStorage.setItem('refresh_token', data['refresh_token'])
          localStorage.setItem('access_token', data['access_token'])
          localStorage.setItem('user_email', email)
          this.userIsLoggedIn.next(true)
          this.signUpMessage.next(data['message'])
          }
        )
      
      )
  }

  logInService(email:string, password:string){
    return this.http.post("http://127.0.0.1:8000/account/api-vi/sign-in/", {
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
      localStorage.setItem('user_email', email)

      this.loginResponseData.next(loginResponse)
      this.userIsLoggedIn.next(true)
    })

  )
}
  
  logOut(refresh:any) {
    return this.http.post("http://127.0.0.1:8000/account/api-vi/sign-out/",{refresh}).pipe(
      tap( (data:any) => {
        this.userIsLoggedIn.next(false)
        this.logoutResponseData.next(data.detail)
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_email')
    }),
  )}

  
  private handleError(errorRes:HttpErrorResponse){
    let errorMessage = 'an unknown error occurred'
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
