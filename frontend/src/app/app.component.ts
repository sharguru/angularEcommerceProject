import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { RestServiceService } from './rest-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecommerceProject';
  constructor(private auth:AuthService,private router : Router,private restService : RestServiceService){

  }

  ngOnInit(){
    console.log(this.authLogged);
    console.log(this.authUser);
    
  }

  // showlogin = this.auth.loginBtn
  // showlogout = this.auth.logoutBtn
  authLogged = localStorage.getItem(this.auth.varLogged)
  // showlogout = localStorage.getItem("isLogged")
  // currectUser = this.auth.currentLoggedUSer

  authUser =  JSON.parse(localStorage.getItem(this.auth.currentSessionUser) || '{}')

  logoutClick(){    
    location.reload()
    this.auth.logout()
    this.router.navigate(["/"])
  }
  
  
}
