import { Component, OnInit, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import {AuthService} from '../../services/auth.service'
import { FormGroup, FormControl,FormBuilder, Validators } from '@angular/forms';
import {ChangeDetectorRef } from '@angular/core';
import { SignUpModel } from 'src/app/models/auth.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  constructor(public authService: AuthService,
              private fb: FormBuilder,
              private cdref: ChangeDetectorRef,
              private router: Router,          
    ){}

  ngAfterContentChecked() {
    this.cdref.detectChanges();   
      }
  signupError: string = '';
  signupSuccess: string = '';
  signUpForm: FormGroup;
  snippingLoading: boolean = false;
  showPasswordStatus: boolean = false;
  showDetails: boolean=true;

  onStrengthChanged(strength: number) {
  }

  ngOnInit(){ 

    this.signUpForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email, 
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-z]{2,7}$")
      ]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}') ]],
      password1: ['', [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,15}')]],
    });
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

}
