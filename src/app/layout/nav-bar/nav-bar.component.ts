import { AppUser } from 'src/app/models/app-users';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  appUser: AppUser | null = null;

  constructor(public auth: AuthService) {
    auth.appUser$.subscribe(appUser => this.appUser = appUser)
  }

  logout() {
    this.auth.logout();
  }
}
