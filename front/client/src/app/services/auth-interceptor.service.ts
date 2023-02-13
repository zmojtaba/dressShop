import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService:AuthService) { }
  intercept(request:HttpRequest<any>, next:HttpHandler){
    if (!localStorage.getItem('refresh_token') || !localStorage.getItem('access_token')){
      console.log( '-----------------*****************---------------' ,request)

      return next.handle(request)
    }
    const token = localStorage.getItem('refresh_token')
    const modifiedRequest = request.clone({
      setHeaders: {Authorization: `Authorization Bearer ${token}`}
    });
    console.log( '-----------------*****************---------------' ,modifiedRequest)
    return next.handle(modifiedRequest)
  }
}
