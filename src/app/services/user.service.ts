import { User } from 'firebase/auth';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AppUser } from '../models/app-users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {}
  save(user: User) {
    if (user) {
      const userId = user.uid;
      this.db.object(`users/${userId}`).update({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
    }
  }

  get(uid: string): Observable<AppUser | null> {
    return this.db.object<AppUser>(`/users/${uid}`).valueChanges();
  }
  

  getCurrentUser(): Observable<User | null> {
    return this.afAuth.authState as Observable<User | null>;
  }
}
