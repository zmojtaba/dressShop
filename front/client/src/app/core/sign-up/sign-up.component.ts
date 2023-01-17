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

  onSignUp(form:NgForm){
    this.authService.signUpService(form.value['email'], form.value['password'], form.value['password1'])
    .subscribe(data => {
      console.log(form.value['email'])
    })
  }

}
