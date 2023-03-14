import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import {AuthService} from '../../services/auth.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ChangeDetectorRef } from '@angular/core';
import { SignUpModel } from 'src/app/models/auth.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnChanges {
  constructor(public authService: AuthService,
              private fb: FormBuilder,
              private cdref: ChangeDetectorRef,
              private router: Router,        
    ){}

  ngAfterContentChecked() {
    this.cdref.detectChanges();
    console.log('---------******---------', this.signUpForm)   
      }


  signupError: string = '';
  signupSuccess: string = '';
  signUpForm: FormGroup;
  snippingLoading: boolean = false;
  showPasswordStatus: boolean = false;
  showDetails: boolean=true;
  loginForm : FormGroup;
  loginError : string = '';
  formStatus: string = 'signUp';
  usernameField: string = 'email';
  usernameValidator:any = Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-z]{2,7}$");

  onStrengthChanged(strength: number) {
  }

  ngOnInit(){ 

    this.signUpForm = this.fb.group({
      username: ['', [
        Validators.required,
        this.usernameValidator,
        Validators.email, 
      ]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}') ]],
      password1: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}')]],
    });

    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email, 
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-z]{2,7}$")
      ]],
      password: ['', [Validators.required]],
    })


   }

   onSetEmailAsUsername(){
    this.usernameField = 'email';
    this.usernameValidator = Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-z]{2,7}$");
    this.signUpForm.controls.username.removeValidators
    this.signUpForm.controls.username.setValidators([
      Validators.required,
      this.usernameValidator,
      Validators.email, 
    ])
   }

   onSetPhoneAsUsername(){
    this.usernameField = 'phone';
    this.usernameValidator = Validators.pattern("^([\+]?[0]{1}[0-9]{3}[0-9]{3}[0-9]{4})|([\+]{1}[0-9]{1,3}[0-9]{3}[0-9]{4,6})");
    this.signUpForm.controls.username.removeValidators
    this.signUpForm.controls.username.setValidators([
      Validators.required,
      this.usernameValidator,
    ])
   }

   changeFormToSignIn(){
    this.formStatus = 'signIn'
   }

   changeFormToSignUp(){
    this.formStatus = 'signUp'
   }

   onLogin(form:any){
    const email = form.value.email
    const password = form.value.password
    this.snippingLoading = true
    this.authService.logInService(email, password)
    .subscribe(data => {
      console.log(data)
      this.snippingLoading = false;
      this.router.navigate([''])
    }, err => {
      this.loginError = err
      this.snippingLoading = false
    
    })
    
  }

   

 OnPasswordToggle(){
  this.showPasswordStatus = !this.showPasswordStatus;
 }

  onSignUp(form:any){
    this.snippingLoading = true;
    const email = form.value.email
    const password = form.value.password
    const password1 = form.value.password1
    
    this.authService.signUpService(email, password, password1)
    .subscribe((data : SignUpModel) => {
      this.snippingLoading = false
      this.signupSuccess = data['message']
      this.router.navigate(['/'])
    }, errorMessage => {
      this.snippingLoading = false
      this.signupError = errorMessage
    }); 
    form.reset()   
    
  }
  
  ngOnChanges(changes: SimpleChanges) {
    // console.log('-------------------------', changes )
  }

}
