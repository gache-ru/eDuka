import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private afAuth: AngularFireAuth) {
  }

  login() {
    const provider = new GoogleAuthProvider();
    this.afAuth.signInWithRedirect(provider);
  }

  logout() {

  }
}
