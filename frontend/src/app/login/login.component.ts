import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RestServiceService } from '../rest-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!:FormGroup
  registerForm !: FormGroup
  constructor(private restService : RestServiceService, private auth : AuthService,private router : Router) { 
    this.loginForm = new FormGroup({
      userEmail : new FormControl('',[Validators.required]),
      userPassword : new FormControl('',[Validators.required])
    })
    this.registerForm = new FormGroup({
      regEmail : new FormControl("",[Validators.email,Validators.required]),
      regUserName : new FormControl("",[Validators.required]),
      regPhone : new FormControl("",[Validators.required,Validators.minLength(10)]),
      regPassword : new FormControl("",[Validators.required,Validators.minLength(8)])
    })
  }
  get userEmail(){return this.loginForm.get(['userEmail'])}
  get userPassword(){return this.loginForm.get(['userPassword'])}


  get regEmail(){return this.registerForm.get(['regEmail'])}
  get regUserName(){return this.registerForm.get(['regUserName'])}
  get regPhone(){return this.registerForm.get(['regPhone'])}
  get regPassword(){return this.registerForm.get(['regPassword'])}

  ngOnInit(): void {
  }

  users =[]
  onLogin(){

    this.restService.searchUser(this.loginForm.value).subscribe(
      data => {
        this.auth.login(data)
        this.router.navigate(["/"])
      },
      err => {
        console.log(err)
        alert("Invalid Email or Password")
        
      }
      
    )
  
    
  }
  onRegister(){
    let newUser ={
      "email" : this.registerForm.get(['regEmail'])?.value,
      "userName" : this.registerForm.get(['regUserName'])?.value,
      "phone" : this.registerForm.get(['regPhone'])?.value,
      "password" : this.registerForm.get(['regPassword'])?.value
    }

    this.restService.addUser(this.registerForm.value).subscribe(
      data => {
        alert("User Registered Successfully")
        this.registered()      },
      err=> {console.log(err)
      
        alert("User Registered Successfully")
        this.registered()  }
    )
  }

  isLogin = true

  notRegisterted(){
    this.isLogin = false
  }
  registered(){
     this.isLogin = true
  }


}


