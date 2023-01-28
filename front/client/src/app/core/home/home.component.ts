import { Component, OnInit,OnChanges ,OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoginModel } from 'src/app/models/auth.model';
import { Subscription, take } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,OnChanges,OnDestroy {
  logMessage :string = 'not log in'
  loginSubscription :Subscription = new Subscription()
  logoutSubcription: Subscription = new Subscription()
  loginData: LoginModel;
  logoutData: string;
  userIsLoggedIn :boolean;
  constructor(private authService: AuthService){  }

  ngOnInit(): void {
    this.loginSubscription =  this.authService.loginResponseData.subscribe(data => {
      this.loginData = data;
    })

    this.authService.userIsLoggedIn.subscribe( (data)=>{
      this.userIsLoggedIn = data
    })

    this.logoutSubcription = this.authService.logoutResponseData.pipe(
      take(1)
    )
    .subscribe( (data) => {
      this.logoutData = data
    })

  }

  ngOnChanges() {

  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe()
    this.logoutSubcription.unsubscribe()

  }

  
}
