import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {path: '/', component: },
  { path: 'login', loadChildren: () => import('./core/login/login.module').then(m => m.LoginModule) },
  { path: 'sign-up', loadChildren: () => import('./core/sign-up/sign-up.module').then(m => m.SignUpModule) },
  { path: '', loadChildren: () => import('./core/home/home.module').then(m => m.HomeModule) },
  { path: 'nav-side', loadChildren: () => import('./core/side-bar/side-bar.module').then(m => m.SideBarModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
