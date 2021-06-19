import { UtilitiesService } from 'src/app/services/utilities.service';
import { LoginComponent } from '../login/login.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  title: string;
  desc: string;
  isDarkTheme?: BehaviorSubject<boolean>;
  constructor(private dialog: MatDialog, private uts: UtilitiesService) {
    this.isDarkTheme = this.uts.observeDarkMode;
    this.title = this.uts.title;
    this.desc = this.uts.desc;
  }

  openLoginDialog = () => this.dialog.open(LoginComponent, { width: '30rem' });

  ngOnInit(): void {}
}
