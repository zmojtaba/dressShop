import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginModule } from './core/login/login.module';

const routes: Routes = [
  // {path: '/', component: },
  { path: 'login', loadChildren: () => import('./core/login/login.module').then(m => m.LoginModule) }, { path: 'login', loadChildren: () => import('./core/login/login.module').then(m => m.LoginModule) },
  { path: 'sign-up', loadChildren: () => import('./core/sign-up/sign-up.module').then(m => m.SignUpModule) },
  { path: '', loadChildren: () => import('./core/home/home.module').then(m => m.HomeModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
