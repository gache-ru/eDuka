import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsRef: AngularFireList<Product>;

  constructor(private db: AngularFireDatabase) {
    this.productsRef = this.db.list('/products');
  }

  create(product: Product) {
    return this.productsRef.push(product);
  }

  getAll(): AngularFireList<Product> {
    return this.productsRef;
  }

  get(key: string) {
    return this.db.object('/products/' + key).valueChanges();
  }

  update(key: string, product: Product) {
    return this.db.object('/products/' + key).update(product);
  }

  delete(key: string) {
    return this.db.object('/products/' + key).remove();
  }
}