import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class AuthRefreshService {

  constructor(private http:HttpClient) { }
  
  renewAccessTokenService(refresh_token:string){
    return this.http.post('http://127.0.0.1:8000/account/api-vi/sign-in/refresh/', refresh_token)
  }
}
