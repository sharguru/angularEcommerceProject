import { Component, OnInit } from '@angular/core';
import { RestServiceService } from '../rest-service.service';
import { Options } from "@angular-slider/ngx-slider";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  //Slider for price 
  lowValue: number = 40;
  highValue: number = 200;
  priceOptions: Options = {
    floor: 1,
    ceil: 1000
  };
  openPriceSlider = false
  openFilterByPrice(){
    this.openPriceSlider = !this.openPriceSlider
    this.openRatingSlider = false
  }
  closeFilterByPrice(){
    this.openPriceSlider = false
    this.restService.getWithinPrice(this.lowValue, this.highValue).subscribe(
      data => {
        console.log(data);
        
        this.allProductArray = data},
        err => console.log(err)  
    )
  }

  ////rating slider
  lowRating: number = 2;
  highRating: number = 3;
  ratingOptions: Options = {
    floor: 1,
    ceil: 5
  };
  openRatingSlider = false
  openFilterByRating(){
    this.openRatingSlider = !this.openRatingSlider
    this.openPriceSlider = false
  }
  closeFilterByRating(){
    this.openRatingSlider = false
    this.restService.getWithinRating(this.lowRating, this.highRating).subscribe(
      data => {
        console.log(data);
        
        this.allProductArray = data},
        err => console.log(err)  
    )
  }

  constructor(private restService : RestServiceService) { }
  ngOnInit(): void {
    
    this.getProductsFromDB()
    }
  allProductArray:Array<any> = []


  getProductsFromDB(){

    this.restService.getAllProducts().subscribe(
      data => {
        console.log(data);
        
        this.allProductArray = data},
      err => console.log(err)
    )
  }

  

  getMensProductsFromDB(){
    this.restService.getMen("men's clothing").subscribe(
      data => this.allProductArray = data,
      err => console.log(err)
    )
    
    // subscribe(
    //   data => this.allProductArray = data.filter((e: { category: string; }) => e.category == "men's clothing"),
    //   err => console.log(err)
      
    // )
  }  
  getWomenProductFromDB(){
    this.restService.getWomen("women's clothing").subscribe(
      data => this.allProductArray = data,
      err => console.log(err)
      
    )
  }
getAccessoriesProductFromDB(){
  this.restService.getAccessories("jewelery").subscribe(
    data => this.allProductArray = data,
    err => console.log(err)
    
  )
}
getElectronicsProductFromDB(){
  this.restService.getElectronics("electronics").subscribe(
    data => this.allProductArray = data,
    err => console.log(err)
    
  )
}
roundFucntion(num:number){
    return Math.round(num)
  }
// cartItems:Array<any> = []
  addToCart(id:number){
    this.restService.getById(id).subscribe(
      data => console.log("products",data),
      err => console.log(err)
    )


    // let newCartItem = this.allProductArray.filter(e => e.id == id)
    // this.restService.addItemToCart(newCartItem[0]).subscribe(
    //   data => {
    //     console.log("added");
        
    //   },
    //   err => console.log(err) 
    // )
  }


}

