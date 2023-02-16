import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService,
              private router: Router){}
  userIslogedIn: boolean = false;
  userEmail: string | null ;


  onLogOut(){
    const refresh_token = localStorage.getItem('refresh_token')
    this.authService.logOut(refresh_token).subscribe()
    this.router.navigate([''])    
  }

  ngOnInit(): void {


      this.authService.userIsLoggedIn.subscribe( (data:boolean) => this.userIslogedIn = data)

      this.userEmail = localStorage.getItem('user_email')

  }
  ngOnChanges(changes: SimpleChanges) {
    this.userEmail = localStorage.getItem('user_email') 
  }

}
