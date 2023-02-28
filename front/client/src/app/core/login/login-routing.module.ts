import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login.component';
import { SetPasswordComponent } from './set-password/set-password.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'forgot-password/set-password/:token', component: SetPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
