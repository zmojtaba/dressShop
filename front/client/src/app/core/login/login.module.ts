import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';



@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    SetPasswordComponent,
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MatSlideToggleModule,
    PasswordStrengthMeterModule.forRoot(),
    MatPasswordStrengthModule,
    MatFormFieldModule,
    FormsModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  exports: [
    ForgotPasswordComponent,
    SetPasswordComponent
  ]
})
export class LoginModule { }
