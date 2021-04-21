import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
type UserCredential = Promise<firebase.default.auth.UserCredential>;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  createNewUser(email: string, password: string): UserCredential {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  login(email: string, password: string): UserCredential {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  resetPassword(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  logOut(): void {
    this.afAuth.signOut();
    this.router.navigate(['landingPage']);
  }
}
