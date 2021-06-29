import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/database/user.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Category } from 'src/app/models/category.model';
import { MatDialog } from '@angular/material/dialog';
import { AddPubPikComponent } from './add-pub-pik/add-pub-pik.component';
import { PubpikService } from 'src/app/services/database/pubpik.service';

@Component({
  selector: 'app-menu-components',
  templateUrl: './menu-component.html',
  styleUrls: ['./menu-component.scss'],
})
export class MenuComponentsComponent implements OnInit {
  userID = '';
  title: string;
  currentRoute?: string;
  currentUserData?: Observable<User | undefined>;
  isDarkTheme?: BehaviorSubject<boolean>;
  interestCenters?: Promise<Category[]>;
  constructor(
    private uts: UtilitiesService,
    private us: UserService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private ps: PubpikService,
    private router: Router
  ) {
    this.title = this.uts.title;

    this.userID = this.route.snapshot.data.user.uid;

    this.router.events.subscribe(() => (this.currentRoute = this.router.url));

    // observation du theme
    this.isDarkTheme = this.uts.observeDarkMode;

    // données de l'utilisateur courrement connecté
    this.currentUserData = this.us.getUser(this.userID);

    this.interestCenters = this.us.getInterestCenter(this.userID);
  }

  ngOnInit(): void {}

  switchTheme = () => this.uts.switchTheme();

  refreshPage = () => this.uts.refreshPage('pubpik/accueil');

  onFilterByCategory = (category: string) => this.ps.filterPubpiks(category);

  openAddPubPikDialog(): void {
    this.dialog.open(AddPubPikComponent, {
      width: '30rem',
      hasBackdrop: true,
      disableClose: true,
      data: {
        categoriesData: this.interestCenters,
        userData: this.currentUserData,
        title: this.title,
      },
    });
  }
}
