import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import * as firebase from 'firebase/app';
import { Observable, map } from 'rxjs';
import { User } from 'firebase/auth';
import { ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User | undefined>;

  constructor(private afAuth: AngularFireAuth, private route: ActivatedRoute) {
    this.user$ = afAuth.authState.pipe(
      map((user: any) => user || undefined)
    );
  }
  
  login() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);
    
    const provider = new GoogleAuthProvider();
    this.afAuth.signInWithPopup(provider);
  };

  logout() {
    this.afAuth.signOut();
  };
}
