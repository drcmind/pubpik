import { Router } from '@angular/router';
import { title } from './../../../../global_variables';
import { MatDialog } from '@angular/material/dialog';
import { Component, Input, OnInit } from '@angular/core';
import { AddPubPikComponent } from '../add-pub-pik/add-pub-pik.component';
import { Category } from 'src/app/models/category.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  title = title;
  @Input() categories: Category[] = [];
  @Input() userData?: User;

  constructor(private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {}

  openAddPubPikDialog(): void {
    this.dialog.open(AddPubPikComponent, {
      width: '30rem',
      hasBackdrop: true,
      disableClose: true,
      data: { categoriesData: this.categories, userData: this.userData },
    });
  }

  refreshPage(): void {
    this.router.navigate(['']);
    this.router.onSameUrlNavigation = 'reload';
  }
}
