import { Injectable } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { Observable, Observer, fromEvent, merge, BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  isOpenedSidenav?: boolean;
  isOnline?: boolean;
  isSideNavOpenned = new BehaviorSubject<boolean>(false);
  constructor(private router: Router, private mediaObserver: MediaObserver) {
    this.isSideNavOpenned.subscribe((value) => (this.isOpenedSidenav = value));
    this.createOnline$().subscribe((isOnline) => (this.isOnline = isOnline));
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

  refreshPage(pageToRefresh: string): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([pageToRefresh]);
  }

  mediaQueryObserver(): Observable<MediaChange> {
    return this.mediaObserver.asObservable().pipe(
      filter((changes: MediaChange[]) => changes.length > 0),
      map((changes: MediaChange[]) => changes[0])
    );
  }
}
