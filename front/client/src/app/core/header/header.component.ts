import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService){}
  userIslogedIn: boolean = false;
  userEmail: string | null ;


  onLogOut(){
    const refresh_token = localStorage.getItem('refresh_token')
    this.authService.logOut(refresh_token).subscribe()    
  }

  ngOnInit(): void {


      this.authService.userIsLoggedIn.subscribe( (data:boolean) => this.userIslogedIn = data)

      this.userEmail = localStorage.getItem('user_email')

  }

}
