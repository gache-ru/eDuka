import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { CategoryService } from './../../services/category.service';
import { CategoryWithKey } from 'src/app/models/category';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  categories$: Observable<CategoryWithKey[]> | undefined;
  imgUrlPattern = 'https?://.+';
  productForm!: FormGroup;
  id: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.getCategories();

    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(100)]],
      category: ['', Validators.required],
      imageUrl: ['', [Validators.required, this.urlValidator()]],
    });

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.id = params.get('id');
          if (this.id) {
            return this.productService.get(this.id);
          } else {
            return of(null);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((product) => {
        if (product) {
          this.productForm.patchValue(product);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  save(product: Product) {
    if (this.id) {
      this.productService
        .update(this.id, product)
        .then(() => {
          this.router.navigate(['/admin/products']);
        })
        .catch((error) => console.error(error));
    } else {
      this.productService
        .create(product)
        .then(() => {
          this.router.navigate(['/admin/products']);
        })
        .catch((error) => console.error(error));
    }
  }

  // URL Validator (Now inside the component)
  urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values here, use 'required'
      }

      const urlRegex =
        /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))?)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

      if (urlRegex.test(control.value)) {
        return null; // Valid URL
      } else {
        return { invalidUrl: true }; // Invalid URL
      }
    };
  }

  deleteProduct() {
    if (this.id && confirm('Are you sure you want to delete this product?')) {
      this.productService
        .delete(this.id)
        .then(() => {
          this.router.navigate(['/admin/products']);
        })
        .catch((error) => console.error("Error deleting product:", error));
    }
  }
}
