import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import * as firebase from 'firebase/app';
import { Observable, map, of } from 'rxjs';
import { User } from 'firebase/auth';
import { ActivatedRoute } from '@angular/router';
import { AppUser } from '../models/app-users';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User | undefined>;

  constructor(private afAuth: AngularFireAuth, private route: ActivatedRoute, private userService: UserService) {
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

  get appUser$(): Observable<AppUser | null> {
    return this.user$.pipe(
      switchMap((user) => {
        if (!user) return of(null); 
        return this.userService.get(user.uid); 
      })
    );
  }
}
