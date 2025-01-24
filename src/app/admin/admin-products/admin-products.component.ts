import { Component, OnInit } from '@angular/core';
import { Observable, catchError, of, map } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {
  products$: Observable<Product[]> | undefined;
  error$: Observable<any> | undefined;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // In your component:
loadProducts() {
  this.products$ = this.productService.getAll().snapshotChanges().pipe(
    map(changes =>
      changes.map(c => ({ key: c.payload.key, ...c.payload.val() as object })) as Product[]
    ),
    catchError(error => {
      this.error$ = of(error);
      return of([]);
    })
  );
}

  deleteProduct(key: string): void {
    if(confirm('Are you sure to delete this product?')){
      this.productService.delete(key)
      .then(() => this.loadProducts())
      .catch((error) => {
        console.error('Error deleting product:', error);
        this.error$ = of(error);
      });
    }
    
  }
}