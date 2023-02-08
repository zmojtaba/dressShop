import { Component, OnInit, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import {AuthService} from '../../services/auth.service'
import { FormGroup, FormControl,FormBuilder, Validators } from '@angular/forms';
import {ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  constructor(public authService: AuthService,private fb: FormBuilder,
              private cdref: ChangeDetectorRef          
    ){}

  ngAfterContentChecked() {
    this.cdref.detectChanges();   
      }
  signupError: string = '';
  signupSuccess: string = '';
  signUpForm: FormGroup;
  snippingLoading: boolean = false;


  showDetails: boolean=true;

  onStrengthChanged(strength: number) {
  }

  ngOnInit(){ 

    this.signUpForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email, 
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ]],
      password: ['', [Validators.required, Validators.minLength(8) ]],
      password1: ['', [Validators.required, Validators.minLength(8)]],
    });
   }
   

   get signUpFormControls(): any {
    return this.signUpForm['controls'];
 }

  onSignUp(form:any){
    this.snippingLoading = true;
    const email = form.value.email
    const password = form.value.password
    const password1 = form.value.password1
    
    this.authService.signUpService(email, password, password1)
    .subscribe((data : any) => {
      this.snippingLoading = false
      this.signupSuccess = data['message']
    }, errorMessage => {
      this.snippingLoading = false
      this.signupError = errorMessage
    }); 
    form.reset()   
    
  }

}
