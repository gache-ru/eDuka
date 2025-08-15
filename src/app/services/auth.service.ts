import { switchMap, catchError } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import * as firebase from 'firebase/app';
import { Observable, map, of, throwError } from 'rxjs';
import { User } from 'firebase/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUser } from '../models/app-users';
import { UserService } from './user.service';
import { NotificationService } from './notification.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User | undefined>;

  constructor(
    private afAuth: AngularFireAuth, 
    private route: ActivatedRoute, 
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.user$ = afAuth.authState.pipe(
      map((user: any) => user || undefined),
      catchError(error => {
        console.error('Auth state error:', error);
        this.notificationService.showError('Authentication error occurred. Please try again.');
        return of(undefined);
      })
    );
  }
  
  async login(): Promise<void> {
    try {
      let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
      localStorage.setItem('returnUrl', returnUrl);
      
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await this.afAuth.signInWithPopup(provider);
      
      if (result.user) {
        this.notificationService.showSuccess('Successfully logged in!');
        
        // Navigate to return URL after successful login
        const storedReturnUrl = localStorage.getItem('returnUrl') || '/';
        localStorage.removeItem('returnUrl');
        this.router.navigateByUrl(storedReturnUrl);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Login was cancelled.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups and try again.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      this.notificationService.showError(errorMessage);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.notificationService.showSuccess('Successfully logged out!');
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Logout error:', error);
      this.notificationService.showError('Logout failed. Please try again.');
    }
  }

  get appUser$(): Observable<AppUser | null> {
    return this.user$.pipe(
      switchMap((user) => {
        if (!user) return of(null); 
        return this.userService.get(user.uid).pipe(
          catchError(error => {
            console.error('Error fetching user data:', error);
            this.notificationService.showError('Failed to load user data.');
            return of(null);
          })
        ); 
      }),
      catchError(error => {
        console.error('AppUser stream error:', error);
        return of(null);
      })
    );
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user),
      catchError(() => of(false))
    );
  }

  get currentUser$(): Observable<User | null> {
    return this.user$.pipe(
      map(user => user || null),
      catchError(() => of(null))
    );
  }
}
