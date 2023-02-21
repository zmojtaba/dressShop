import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { Subscription, take } from 'rxjs';
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
    this.needToRefreshSubscription =  this.authService.needToRefreshToken.pipe(
      take(1)
    ).subscribe(
      (boolean: boolean)=>{
        if (boolean){
          console.log('============needToRefreshSubscription=========')
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
  ngOnChanges(changes: SimpleChanges) {
    if (localStorage.getItem('access_token')){
      this.needToRefreshSubscription.unsubscribe()
    }
  }

  toggle() {
    this.sidebarService.toggle(true, 'left');
    this.ExpandedSidebar = !this.ExpandedSidebar;
  }
}
