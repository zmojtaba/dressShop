import { Component, OnInit } from '@angular/core';
import { LoginModel } from 'src/app/models/auth.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService){}
  userIslogedIn: boolean = false;


  onLogOut(){
    const refresh_token = localStorage.getItem('refresh_token')
    this.authService.logOut(refresh_token).subscribe()    
  }

  ngOnInit(): void {


      this.authService.userIsLoggedIn.subscribe( (data:boolean) => this.userIslogedIn = data)
  }

}
