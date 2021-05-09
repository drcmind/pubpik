import { BehaviorSubject, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MediaChange } from '@angular/flex-layout';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent implements OnInit {
  userID = '';
  mqObsever?: Observable<MediaChange>;
  isDarkTheme?: BehaviorSubject<boolean>;
  constructor(private uts: UtilitiesService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userID = this.route.snapshot.data.user.uid;

    this.mqObsever = this.uts.mediaQueryObserver();

    this.isDarkTheme = this.uts.observeDarkMode;
  }
}
