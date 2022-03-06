import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,private router : Router) { }

  varLogged = "isLogged"
  currentSessionUser = "sessionUser"
  login(obj:any){
    // this.currentLoggedUSer = item
    
    localStorage.setItem(this.varLogged,"true")
    location.reload()
    localStorage.setItem(this.currentSessionUser, JSON.stringify(obj))
    // return JSON.parse(this.varLogged)
  }
  logout(){
    localStorage.setItem(this.varLogged,"false")
    localStorage.setItem(this.currentSessionUser, JSON.stringify(""))
    // return JSON.parse(this.varLogged)

  }

  canActivate(){
    let bReturn = true 
    if(localStorage.getItem(this.varLogged) == "false"){
      bReturn = false;
      alert(`Sorry! Please Login to Shop`)
      this.router.navigate(['/login'])
    }
    return bReturn
  }

  

}
