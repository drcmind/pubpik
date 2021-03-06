import { BehaviorSubject, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent implements OnInit {
  userID = '';
  isDarkTheme?: BehaviorSubject<boolean>;
  constructor(private uts: UtilitiesService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userID = this.route.snapshot.data.user.uid;
    this.isDarkTheme = this.uts.observeDarkMode;
  }
}
