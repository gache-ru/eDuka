import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavBarComponent } from './layout/nav-bar/nav-bar.component';
import { HomeComponent } from './layout/home/home.component';
import { ProductsComponent } from './layout/products/products.component';
import { ShoppingCartComponent } from './layout/shopping-cart/shopping-cart.component';
import { CheckOutComponent } from './layout/check-out/check-out.component';
import { OrderSuccessComponent } from './layout/order-success/order-success.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { LoginComponent } from './login/login.component';
import { MyOrdersComponent } from './layout/my-orders/my-orders.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: 'shopping-cart',
    component: ShoppingCartComponent
  },
  {
    path: 'check-out',
    component: CheckOutComponent
  },
  {
    path: 'order-success',
    component: OrderSuccessComponent
  },
  {
    path: 'my/orders',
    component: MyOrdersComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin/products',
    component: AdminProductsComponent
  },
  {
    path: 'admin/orders',
    component: AdminOrdersComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
