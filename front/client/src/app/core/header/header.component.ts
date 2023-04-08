import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NbDialogService } from '@nebular/theme';
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService,
              private router: Router,
              private dialogService: NbDialogService,
                ){}

  userIslogedIn: boolean = false;
  userEmail: string | null ;


  onSignUp() {
    const dialogRef = this.dialogService.open(SignUpComponent, {    context: {
      formStatus: 'signUp',
    }, },);
  }

  onSignIn() {
    const dialogRef = this.dialogService.open(SignUpComponent, {    context: {
      formStatus: 'signIn',
    }, },);
  }


  protected open(closeOnBackdropClick: boolean) {
    this.dialogService.open(SignUpComponent, { closeOnBackdropClick ,context: 'pass data in template' },);
  } 


  onLogOut(){
    const refresh_token = localStorage.getItem('refresh_token')
    this.authService.logOutService(refresh_token).subscribe()
    this.router.navigate([''])    
  }

  ngOnInit(): void {


      this.authService.userIsLoggedIn.subscribe( (data:boolean) => {
        this.userIslogedIn = data
      if (this.userIslogedIn = data)  {this.userEmail = localStorage.getItem('user_email')}
      })

  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.userIslogedIn){
      console.log('*************', this.userIslogedIn)
    }
  }

}
