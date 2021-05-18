import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { desc, title } from 'src/app/services/utilities/global_variables';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit, OnDestroy {
  title = title;
  desc = desc;
  isDarkTheme?: BehaviorSubject<boolean>;
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private uts: UtilitiesService
  ) {
    this.isDarkTheme = this.uts.observeDarkMode;
  }
  openLoginDialog(): void {
    this.dialog.open(LoginComponent, {
      width: '30rem',
      hasBackdrop: true,
      disableClose: true,
    });
  }

  goToRegister = () => this.router.navigate(['/register']);

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
