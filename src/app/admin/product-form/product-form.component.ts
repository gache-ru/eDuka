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
import { CategoryService} from './../../services/category.service';
import { CategoryWithKey } from 'src/app/models/category';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})

export class ProductFormComponent {
  categories$: Observable<CategoryWithKey[]> | undefined;

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();
  }
}



