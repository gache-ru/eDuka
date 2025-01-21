import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private userService: UserService) {}

  canActivate(): Observable<boolean> {
    return this.auth.user$.pipe(
      switchMap((user) => {
        if (!user) return [false]; // Deny access if no user
        return this.userService.get(user.uid).pipe(
          map((appUser) => !!appUser?.isAdmin) // Check if user is an admin
        );
      })
    );
  }
}
