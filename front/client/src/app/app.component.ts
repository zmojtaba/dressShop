import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'client';
  ExpandedSidebar = false;
  needToRefreshSubscription : Subscription;
  constructor(
    private sidebarService: NbSidebarService,
    private authService : AuthService,
  ){}
  ngOnInit() {
    this.needToRefreshSubscription =  this.authService.needToRefreshToken.subscribe(
      (boolean: boolean)=>{
        if (boolean){
          const refresh_token : any = localStorage.getItem('refresh_token');
          this.authService.renewAccessTokenService(refresh_token).subscribe(
            (response:any) =>{
              localStorage.setItem('refresh_token', response.refresh )
              localStorage.setItem('access_token', response.access )
            }
          )
        }
      }
    )
  }

  ngOnDestroy(){
    this.needToRefreshSubscription.unsubscribe()
  }

  toggle() {
    this.sidebarService.toggle(true, 'left');
    this.ExpandedSidebar = !this.ExpandedSidebar;
  }
}
