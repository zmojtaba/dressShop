import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private authService: AuthService,
              private router: Router,
               ){}
  loadingSpinner: boolean = false;
  loginError : string = ''
  onLogin(form:NgForm){
    const email = form.value.email
    const password = form.value.password
    this.loadingSpinner = true
    this.authService.logInService(email, password)
    .subscribe(data => {
      console.log(data)
      this.loadingSpinner = false;
      this.router.navigate([''])
    }, err => {
      this.loginError = err
      this.loadingSpinner = false
    
    })
    
  }

}
