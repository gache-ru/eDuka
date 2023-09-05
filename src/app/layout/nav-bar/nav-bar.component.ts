import { Observable, map } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component } from '@angular/core';
import * as firebase from 'firebase/app';
import { User } from 'firebase/auth';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  user$: Observable<User | undefined>;

  constructor(private afAuth: AngularFireAuth) {
    // this.user$ = afAuth.authState;
    this.user$ = afAuth.authState.pipe(
      map((user: any) => user || undefined)
    );
  }

  logout() {
    this.afAuth.signOut();
  }
}
