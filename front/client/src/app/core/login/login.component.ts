import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loadingSpinner: boolean = false;
  loginError : string = ''
  loginForm : FormGroup;

  constructor(private authService: AuthService,
              private router: Router,
              private fb: FormBuilder
               ){}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email, 
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-z]{2,7}$")
      ]],
      password: ['', [Validators.required]],
    })
  }

  onLogin(form:any){
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
