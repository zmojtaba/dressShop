import { Injectable, SimpleChanges } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http"
import {  BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { LoginModel, SignUpModel } from '../models/auth.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl              = environment.apiUrl 
  loginResponseData   = new BehaviorSubject<LoginModel>(null!)
  userIsLoggedIn      = new BehaviorSubject<boolean>(false)
  logoutResponseData  = new BehaviorSubject<string>('')
  needToRefreshToken  = new BehaviorSubject<boolean>(false)
  signUpMessage       = new BehaviorSubject<string>('')

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
    return this.http.post(this.apiUrl + '/account/api-vi/sign-in/refresh/',
     {
      refresh :refresh_token
    })
  }

  signUpService(username:string, password:string, password1:string) {
    return this.http.post(this.apiUrl + "/account/api-vi/sign-up/", {
      username: username,
      password: password, 
      password1: password1
    }).pipe(
        catchError(this.handleError),
        tap( (data:any)=> {
          localStorage.setItem('refresh_token', data['refresh_token'])
          localStorage.setItem('access_token', data['access_token'])
          localStorage.setItem('user_email', username)
          this.userIsLoggedIn.next(true)
          this.signUpMessage.next(data['message'])
          }
        )
      
      )
  }

  logInService(username:string, password:string){
    return this.http.post(this.apiUrl + "/account/api-vi/sign-in/", {
      username: username,
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
      localStorage.setItem('user_email', username)

      this.loginResponseData.next(loginResponse)
      this.userIsLoggedIn.next(true)
    })

  )
}
  
  logOutService(refresh:any) {
    return this.http.post(this.apiUrl + "/account/api-vi/sign-out/",{refresh}).pipe(
      tap( (data:any) => {
        this.userIsLoggedIn.next(false)
        this.logoutResponseData.next(data.detail)
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_email')
    }),
  )}

  sendForgotPasswordEmail(email: string ){
    return this.http.post(this.apiUrl + "/account/api-vi/email/reset-password/", {
      email: email
    }).pipe(
      catchError(this.handleError),
      map( (data: any) => {
        return data.detail
      } )
    )
  }

  changeForgottenPassword (token: string, newPassword: string, newPasswordConfirm: string) {
    return this.http.post(this.apiUrl + `/account/api-vi/reset-password/${token}`,{
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm
    }).pipe(
      catchError(this.handleError),
      map( (data:any) => data.detail )
    )
  
  }

  resendVerificationEmail (email: string) {
    return this.http.post(this.apiUrl + "/account/api-vi/email/resend/", {
      email: email,
    }).pipe(
      catchError(this.handleError),
    )
  }

  
  private handleError(errorRes:HttpErrorResponse){
    let errorMessage = 'an unknown error occurred'
    console.log('-----------',errorRes)
    if (!errorRes.error){
      return throwError(errorMessage)
    }
    if(errorRes.error.username){
      errorMessage=errorRes.error['username']
    }
    if(errorRes.error['password']){
      errorMessage=errorRes.error['password']
    }
    if (errorRes.error['password1']){
      errorMessage=errorRes.error['password1']
    }
    if (errorRes.error['detail']){
      errorMessage=errorRes.error['detail']
    }else{
      return throwError(errorMessage)
    }
    return throwError(errorMessage)
  }
}
