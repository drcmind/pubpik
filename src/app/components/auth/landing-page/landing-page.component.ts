import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { LoginComponent } from '../login/login.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { desc, title } from 'src/app/services/utilities/global_variables';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  title = title;
  desc = desc;
  isDarkTheme?: BehaviorSubject<boolean>;
  constructor(private dialog: MatDialog, private uts: UtilitiesService) {
    this.isDarkTheme = this.uts.observeDarkMode;
  }

  openLoginDialog = () => this.dialog.open(LoginComponent, { width: '30rem' });

  ngOnInit(): void {}
}
