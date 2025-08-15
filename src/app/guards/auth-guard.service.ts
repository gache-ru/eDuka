import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService, 
    private router: Router,
    private notificationService: NotificationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.user$.pipe(
      map(user => {
        if (user) {
          return true;
        } else {
          // Store the attempted URL for redirecting after login
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl: state.url } 
          });
          
          this.notificationService.showWarning('Please log in to access this page.');
          return false;
        }
      }),
      catchError(error => {
        console.error('Auth guard error:', error);
        this.notificationService.showError('Authentication check failed. Please try logging in again.');
        this.router.navigate(['/login'], { 
          queryParams: { returnUrl: state.url } 
        });
        return of(false);
      }),
      tap(result => {
        if (!result) {
          console.log(`Access denied to ${state.url} - user not authenticated`);
        }
      })
    );
  }
}
