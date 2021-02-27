import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  createNewUser(
    email: string,
    password: string
  ): Promise<firebase.default.auth.UserCredential> {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  async login(email: string, password: string): Promise<void> {
    await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  resetPassword(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  logOut(): void {
    this.afAuth.signOut();
  }
}
