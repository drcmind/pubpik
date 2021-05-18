import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { title } from 'src/app/services/utilities/global_variables';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  title = title;

  constructor(private router: Router) {}

  ngOnInit(): void {}
  goToHome = () => this.router.navigate(['pubpik/accueil']);
}
