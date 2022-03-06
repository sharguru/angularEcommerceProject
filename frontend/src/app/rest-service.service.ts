import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http"
import { observable, Observable, Observer} from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class RestServiceService {

  constructor(private http : HttpClient,private auth : AuthService) { }

  url =" http://localhost:8080"

  getAllProducts():Observable<any>{
    return this.http.get(this.url+'/getAllProducts')
  }

  getById(id:any):Observable<any>{
    return this.http.get(this.url + "/getById/" + id)
  }

  getMen(category:string):Observable<any>{
    let mens =this.http.get(`${this.url}/getMen`)
    return mens
    
    // let filtered!:Array[]  
    // mens.forEach(e => {
    //     if(e.hasOwnProperty("category") == "men's clothing"){
    //       filtered.push(e)
    //     } 
    // })
    // return filtered
  }

  getWomen(category:string):Observable<any>{
    let women = this.http.get(`${this.url}/getWomen`)

    return women
  }

  getAccessories(category:string):Observable<any>{
    let accessories = this.http.get(`${this.url}/getAccessories`)
    return accessories
  }
  getElectronics(category:string):Observable<any>{
    let electronics = this.http.get(`${this.url}/getElectronics`)

    return electronics
  }

  getWithinPrice(low:number,high:number):Observable<any>{
    return this.http.post(
      this.url +"/getWithinPrice",
      JSON.stringify({low:low , high:high}),
      {"headers" : {
        "content-type" : "application/json",
        "responseType" :"text"

        }}
    )
  }
  getWithinRating(low:number,high:number):Observable<any>{
    return this.http.post(
      this.url +"/getWithinRating",
      JSON.stringify({low:low , high:high}),
      {"headers" : {
        "content-type" : "application/json",
        "responseType" :"text"

        }}
    )
  }
////////////////////users....................



  // getUsers():Observable<any>{
  //   let users = this.http.get(this.url)
  //   return users
  // }

  searchUser(obj:any):Observable<any>{
    return this.http.post(
      this.url +"/searchUser",
      JSON.stringify(obj),
      {"headers" : {
        "content-type" : "application/json",
        "responseType" :"text"

        }}
      )
  }

  addUser(userObj:any):Observable<any>{

    return this.http.post(
      this.url + '/register',
      JSON.stringify(userObj),
      {"headers" : {
        "content-type" : "application/json",
        "responseType" :"text"
        }})
    }


////////////////////cart....................
cartUrl ="http://localhost:3000/cart"
addItemToCart(userObj:any):Observable<any>{
      let userObjWQ = {
        ...userObj,
        quantity : 1
      }
      return this.http.post(
        this.url+'/addToCart',
        JSON.stringify({id : this.currentUser.id,obj :userObjWQ}),
        {"headers" : {
          "content-type" : "application/json",
          "responseType" :"text"
          }})

    }
getcartItems():Observable<any>{
  return this.http.get(this.url+'/getCartItems/'+ this.currentUser.id)
}
deleteCartItems(delId:any):Observable<any>{
  return this.http.delete(`${this.url}/deleteCartItem/${this.currentUser.id}/${delId}`)
}

increaseQuantity(id:number):Observable<any>{
  return this.http.post(
    `${this.url}/incQuan`,
    JSON.stringify({"userId":this.currentUser.id ,'productId':id}),
    {"headers" : {
      "content-type" : "application/json",
      "responseType" :"text"
      }})
    
  // let oldQuant !: any
  // // this.http.get(`${this.cartUrl}/${id}`).subscribe(
  // //   data => oldQuant  = data
  // // )
  // // return this.http.patch(`${this.cartUrl}/${id}`,{quantity : oldQuant.quantity})
  //   return oldQuant
}

decreaseQuant(id:number):Observable<any>{
  return this.http.post(
    `${this.url}/decQuan`,
    JSON.stringify({"userId":this.currentUser.id ,'productId':id}),
    {"headers" : {
      "content-type" : "application/json",
      "responseType" :"text"
      }})}
      
      ////send Mail 
    
sendMail(obj : any):Observable<any>{
  return this.http.post(
    this.url + "/sendEmail",
    JSON.stringify(obj),
    {"headers" : {
      "content-type" : "application/json",
      "responseType" :"text"
      }}
    )
}
currentUser = JSON.parse(localStorage.getItem(this.auth.currentSessionUser) || '{}')


placeOrder():Observable<any>{
  return this.http.post(
    this.url+"/placeOrder",
  JSON.stringify({"userId":this.currentUser.id}),
  {"headers" : {
    "content-type" : "application/json",
    "responseType" :"text"
    }}
  )
}

getAllOrders():Observable<any>{
  return this.http.get(this.url + "/getAllOrders/"+this.currentUser.id )

}



  }







