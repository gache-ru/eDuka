// import { Component } from '@angular/core';
// import { Observable } from 'rxjs';
// import { CategoryService} from './../../services/category.service';

// @Component({
//   selector: 'app-product-form',
//   templateUrl: './product-form.component.html',
//   styleUrls: ['./product-form.component.scss']
// })
// export class ProductFormComponent {
//   categories$: any;

//   constructor(private categoryService: CategoryService) {
//     this.categories$ = this.categoryService.getCategories();
//   }
// }

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryService } from './../../services/category.service';
import { CategoryWithKey } from 'src/app/models/category';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent {
  categories$: Observable<CategoryWithKey[]> | undefined;
  imgUrlPattern = 'https?://.+';

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();
  }

  save(product: Product) {
    this.productService.create(product)
    console.log(product);
  }
}
