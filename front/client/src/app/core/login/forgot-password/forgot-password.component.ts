import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
resetForm : FormGroup;
errorMessage : string;
successMessage : string;
loadingSpinner:  boolean = false;

constructor(private fb: FormBuilder,
            private authService: AuthService){

}

ngOnInit() {

  this.resetForm = this.fb.group({
    email : ['', [Validators.required, 
                  Validators.email, 
                  Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-z]{2,7}$")]]
  })

}
onSubmit(form: FormGroup){
  let email = form.value.email
  this.loadingSpinner = true;
  this.authService.sendForgotPasswordEmail(email).subscribe( (data) =>{
    console.log('hel dan dan dan hel yedane', data)
    this.successMessage = data
    this.loadingSpinner = false;
  }, (error) =>{
    this.errorMessage = error
    this.loadingSpinner = false;
  } )

  form.reset()
}

}
