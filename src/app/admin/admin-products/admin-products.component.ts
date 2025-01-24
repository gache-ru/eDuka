import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, catchError, of, map, startWith, tap, BehaviorSubject, Subject } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();
  filteredProducts: Product[] = [];
  error$: Observable<any> | undefined;
  query: string = '';
  loading: boolean = true;
  private destroy$ = new Subject<void>();

  constructor(private productService: ProductService) { }

  filter(query: string) {
    this.query = query.toLowerCase();
    this.filterProducts();
  }

  performFilter(products: Product[]): Product[] {
    if (!this.query) {
      return products; // Return ALL products if query is empty
    }
    return products.filter(p => p.title.toLowerCase().includes(this.query));
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c => Object.assign({ key: c.payload.key }, c.payload.val() as Product)) as Product[]
      ),
      catchError(error => {
        this.error$ = of(error);
        return of([]);
      }),
      startWith([]),
      tap(products => {
        this.productsSubject.next(products); // Update the BehaviorSubject
        this.filteredProducts = products; // Initially show all products
        this.loading = false;
      }),
      takeUntil(this.destroy$) // Unsubscribe on destroy
    ).subscribe();
  }

  filterProducts() {
    this.products$.pipe(takeUntil(this.destroy$)).subscribe(products => {
      this.filteredProducts = this.performFilter(products);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteProduct(key: string): void {
    if (confirm('Are you sure to delete this product?')) {
      this.productService.delete(key)
        .then(() => this.loadProducts())
        .catch((error) => {
          console.error('Error deleting product:', error);
          this.error$ = of(error);
        });
    }
  }
}