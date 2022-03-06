import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthService } from './auth.service';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductComponent } from './product/product.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {path:"", component:HomeComponent},
  {path:"login", component:LoginComponent},
  {path:"products", component:ProductsComponent},
  {path:"product", component:ProductComponent,canActivate:[AuthService]},
  {path:"cart", component:CartComponent,canActivate:[AuthService]},
  {path:"checkout", component:CheckoutComponent,canActivate:[AuthService]},
  {path:"orders", component:OrdersComponent,canActivate:[AuthService]},

  {path:"**", component:NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
