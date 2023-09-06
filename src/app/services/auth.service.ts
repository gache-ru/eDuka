import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import * as firebase from 'firebase/app';
import { Observable, map } from 'rxjs';
import { User } from 'firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User | undefined>;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = afAuth.authState.pipe(
      map((user: any) => user || undefined)
    );
  }
  
  login() {
    const provider = new GoogleAuthProvider();
    this.afAuth.signInWithRedirect(provider);
  };

  logout() {
    this.afAuth.signOut();
  };
}
