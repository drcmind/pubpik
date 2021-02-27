import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user) {
          this.router.navigate(['']);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}
