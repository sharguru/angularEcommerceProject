import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RestServiceService } from '../rest-service.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(private auth : AuthService,private restService : RestServiceService,private router : Router) { }

  ngOnInit(): void {
    this.getCartInfo()
  }
  cartItems =[]
  currentUser = JSON.parse(localStorage.getItem(this.auth.currentSessionUser) || '{}')

  getCartInfo(){
    this.restService.getcartItems().subscribe(
      data => {this.cartItems = data
      console.log(this.cartItems);
      
      },
      err => console.log(err)
    )
  }

  totalCartCost(){
    let amt = 0
    this.cartItems.map(e => amt += e['price'] * e['quantity'])
    return Math.round(amt)
  }

  sendMail(){
    let obj = {
      name:this.currentUser.userName,
      emailId : this.currentUser.email,
      total : this.totalCartCost()
    }
    this.restService.sendMail(obj).subscribe(
      data => {
        alert("Email Sent Check Your inbox")
        console.log(data)},
        err => {
        alert("Email Sent Check Your inbox")
        
        console.log(err)}
    )
  }

  placeOrder(){
    this.restService.placeOrder().subscribe(
      data =>{
        alert("Order Placed")
        this.router.navigate(['/products'])
      },
      err =>{ console.log(err)
        alert("Order Placed")
        this.router.navigate(['/products'])
      }
      
    )
  }
}
