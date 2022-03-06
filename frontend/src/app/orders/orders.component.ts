import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { RestServiceService } from '../rest-service.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  constructor(private restService : RestServiceService, private auth : AuthService) { }

  ngOnInit(): void {
    this.getAllOrders()
  }

  ordersTable = []
  currentUser = JSON.parse(localStorage.getItem(this.auth.currentSessionUser) || '{}')
  getAllOrders(){
    this.restService.getAllOrders().subscribe(
      data => this.ordersTable = data,
      err => console.log(err)
      
    )
  }
}
