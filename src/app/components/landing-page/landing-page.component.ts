import { Router } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { title, desc } from 'src/global_variables';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit, OnDestroy {
  title = title;
  desc = desc;
  constructor(private dialog: MatDialog, private router: Router) {}

  openLoginDialog(): void {
    this.dialog.open(LoginComponent, {
      hasBackdrop: true,
      disableClose: true,
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
