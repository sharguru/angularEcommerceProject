import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { RestServiceService } from '../rest-service.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(private restService :RestServiceService,private auth : AuthService) { }

  ngOnInit(): void {
    this.getCartItems()
  }
  cartItems=[]
  currentCustId = JSON.parse(localStorage.getItem(this.auth.currentSessionUser) || '{}')
  
  
  getCartItems(){
    this.restService.getcartItems().subscribe(
      data => {this.cartItems = data
      console.log(this.cartItems);
      
      },
      err => console.log(err)
    )
  }

  deleteItem(id:any){
    this.restService.deleteCartItems(id).subscribe(
      data => this.getCartItems(),
      err => {
        this.getCartItems()
        console.log(err)}
    )
  }

  totalCartCost(){
    let amt = 0
    this.cartItems.map(e => amt += e['price'] * e['quantity'])
    return Math.round(amt)
  }


decreaseQuant(id:any){
  this.restService.decreaseQuant(id).subscribe(
    data => this.getCartItems(),
    err =>{
      this.getCartItems()
       console.log(err)}
    
  )
}
increaseQuant(id:any){
  this.restService.increaseQuantity(id).subscribe(
    data => this.getCartItems(),
    err => console.log(err)
    
  )
}


}
