import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignUpRoutingModule } from './sign-up-routing.module';
import { SignUpComponent } from './sign-up.component';
import { FormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { PasswordStrengthComponent } from './password-strength/password-strength.component';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    SignUpComponent,
    PasswordStrengthComponent
  ],
  imports: [
    CommonModule,
    SignUpRoutingModule,
    FormsModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    PasswordStrengthMeterModule.forRoot(),
    MatPasswordStrengthModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule
  ]
})
export class SignUpModule { }
