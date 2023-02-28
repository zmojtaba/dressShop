import { Component, OnInit,OnChanges ,OnDestroy, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, take } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,OnDestroy {
  logMessage :string = 'not log in'
  loginMessage :string;
  loginSubscription :Subscription = new Subscription()
  logoutSubcription: Subscription = new Subscription()
  logoutMessage: string;
  userIsLoggedIn :boolean;
  signUpMessage: string;
  loadingSpinner = false;
  resendMessage :string;

  constructor(private authService: AuthService){  }

  ngOnInit(): void {
    this.loginSubscription =  this.authService.loginResponseData.subscribe(data => {
      if (data){
      this.loginMessage = 'logged in successfully';
      setTimeout( ()=>{
        this.loginMessage = ''
      } , 3000)}
    })

    this.authService.userIsLoggedIn.subscribe( (data)=>{
      this.userIsLoggedIn = data
    })

    this.logoutSubcription = this.authService.logoutResponseData.subscribe( (data) => {
      if (data){
        this.logoutMessage = data
        setTimeout( ()=>{
          this.logoutMessage = ''
        } , 3000)
      }
    })

    this.authService.signUpMessage.subscribe( (data) => {
      if (data){
        this.signUpMessage = data
        // setTimeout( ()=>{
        //   this.signUpMessage = ''
        // } , 3000)
      }
      
  })

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.userIsLoggedIn){
      console.log('*************', this.userIsLoggedIn)
    }
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe()
    this.logoutSubcription.unsubscribe()

  }
  onResendEmail(){
    this.loadingSpinner = true
    let email: any = localStorage.getItem('user_email')
    this.authService.resendVerificationEmail(email).subscribe( (data)=>{
      this.loadingSpinner = false;
      this.resendMessage = 'Email resend please check your email again!'
    }, (error)=>{
      this.loadingSpinner = false;
    })
  }

  
}
