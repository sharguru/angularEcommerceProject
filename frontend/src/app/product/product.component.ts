import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestServiceService } from '../rest-service.service';
import { filter } from 'rxjs/operators';



@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  id!: number; 
  idProduct = [] as any
  constructor(private restService : RestServiceService,private route : ActivatedRoute) { }
 
  ngOnInit(): void {
  //   this.route.queryParams
  //   .filter((params: { id: any; }) => params.id)
  //   .subscribe((params: { id: number; }) => {
  //     console.log(params); // { id: "popular" }

  //     this.id = params.id;

  //     console.log(this.id);
  // }
  this.route.queryParams.subscribe(param => {
    this.id = param['id']
    
    this.getById(this.id)
  })

}


  getById(id:number){
    this.restService.getById(id).subscribe(
      data => {
        console.log(data);
        console.log(this.idProduct);
        
        this.idProduct.push(data)
        console.log(this.idProduct);
        
      },
      err => console.log(err)
    )   
  }

  addItemToCart(obj: any){
    this.restService.addItemToCart(obj).subscribe(
      data => alert("Added to Cart"),
      err => {
        alert("Added to Cart")
        console.log(err)}
    )
  }






}
