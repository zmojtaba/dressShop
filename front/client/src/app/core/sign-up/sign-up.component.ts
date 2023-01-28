import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import {AuthService} from '../../services/auth.service'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  constructor(public authService: AuthService){}
  signUpSipper: boolean = false;
  signupError: string = '';
  signupSuccess: string = '';;

  onSignUp(form:NgForm){
    if (!form.valid){return}
    const email = form.value.email
    const password = form.value.password
    const password1 = form.value.password1
    
    this.authService.signUpService(email, password, password1)
    .subscribe(data => {
      this.signupSuccess = 'sign up successfully'
    }, errorMessage => {
      this.signupError = errorMessage
    }
    );
    
    form.reset()
    
  }

}
