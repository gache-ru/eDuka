import { AppUser } from './../models/app-users';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate {
  constructor(
    private auth: AuthService, 
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(): Observable<boolean> {
    return this.auth.appUser$.pipe(
      map((appUser) => {
        if (!appUser) {
          this.notificationService.showError('Access denied. Please log in first.');
          this.router.navigate(['/login']);
          return false;
        }
        
        if (!appUser.isAdmin) {
          this.notificationService.showError('Access denied. Admin privileges required.');
          this.router.navigate(['/']);
          return false;
        }
        
        return true;
      }),
      catchError(error => {
        console.error('Admin auth guard error:', error);
        this.notificationService.showError('Authorization check failed. Please try again.');
        this.router.navigate(['/']);
        return of(false);
      }),
      tap(result => {
        if (!result) {
          console.log('Admin access denied - insufficient privileges');
        }
      })
    );
  }
}
