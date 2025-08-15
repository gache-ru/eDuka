import { AppUser } from 'src/app/models/app-users';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {

  appUser: AppUser | null = null;
  cartItemCount = 0; // This would be connected to a cart service in a real app
  private destroy$ = new Subject<void>();

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.auth.appUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(appUser => {
        this.appUser = appUser;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.auth.logout();
  }
}
