import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observer, fromEvent, merge, BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  isOpenedSidenav?: boolean;
  isSideNavOpenned = new BehaviorSubject<boolean>(false);
  observeDarkMode?: BehaviorSubject<boolean>;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private mediaObserver: MediaObserver,
    private snackBar: MatSnackBar
  ) {
    this.isSideNavOpenned.forEach((value) => (this.isOpenedSidenav = value));
    this.initializeAppTheme();
  }

  createOnline$(): Observable<boolean> {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      })
    );
  }

  toogleSidenav = () => this.isSideNavOpenned.next(!this.isOpenedSidenav);

  initializeAppTheme(): void {
    const isDarkTheme = localStorage.getItem('theme') === 'Dark';
    this.observeDarkMode = new BehaviorSubject(isDarkTheme);
    if (isDarkTheme) {
      this.document.documentElement.classList.add('dark-theme');
    }
  }

  switchTheme(): void {
    if (this.document.documentElement.classList.contains('dark-theme')) {
      this.document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('theme', 'Light');
      this.observeDarkMode?.next(false);
    } else {
      this.document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'Dark');
      this.observeDarkMode?.next(true);
    }
  }

  refreshPage = (routeName: string) => {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.navigate([routeName]);
  };

  mediaQueryObserver(): Observable<MediaChange> {
    return this.mediaObserver.asObservable().pipe(
      filter((changes: MediaChange[]) => changes.length > 0),
      map((changes: MediaChange[]) => changes[0])
    );
  }

  showNotification(
    msg: string,
    btnTxt?: string
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(msg, btnTxt, {
      duration: 10000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
