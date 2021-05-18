import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToHome = () => this.router.navigate(['pubpik/accueil']);
}
