import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterLink, RouterLinkActive, RouterState, Routes } from '@angular/router';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

  constructor(public mediaObserver: MediaObserver, public router: ActivatedRoute) { }
  
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
