// import { Injectable } from '@angular/core';
// import { Database, ref, get } from 'firebase/database';
// import { inject } from '@angular/core';
// import { AngularFireDatabase } from '@angular/fire/compat/database';

// @Injectable({
//   providedIn: 'root',
// })
// export class CategoryService {
//   constructor(private db: AngularFireDatabase) {}

//   getCategories() {
//     return this.db.list('/categories');
//   }
// }

import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
  SnapshotAction,
} from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Category {
  name: string;
}

export interface CategoryWithKey extends Category {
  key: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoriesRef: AngularFireList<Category>;

  constructor(private db: AngularFireDatabase) {
    this.categoriesRef = this.db.list('/categories');
  }

  getCategories(): Observable<CategoryWithKey[]> {
    return this.categoriesRef.snapshotChanges().pipe(
      map((changes: SnapshotAction<Category>[]) =>
        changes.map((c) => ({
          key: c.payload.key!,
          ...(c.payload.val() as Category),
        }))
      )
    );
  }

  getCategory(key: string): Observable<Category | null> {
    return this.db.object<Category>(`/categories/${key}`).valueChanges();
  }
}
