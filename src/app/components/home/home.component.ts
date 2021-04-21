import { Observable } from 'rxjs';
import { UtilitiesService } from './../../services/utilities/utilities.service';
import { ActivatedRoute } from '@angular/router';
import { Category } from './../../models/category.model';
import { User } from './../../models/user.model';
import { UserService } from '../../services/database/user.service';
import { Component, OnInit } from '@angular/core';
import { MediaChange } from '@angular/flex-layout';
import { BehaviorSubject } from 'rxjs';
import { title } from 'src/app/services/utilities/global_variables';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  title = title;
  indexPage = 0;
  userEmail: string;
  userID: string;
  isEmailVerified: boolean;
  reloadUser: any;
  isDarkTheme?: BehaviorSubject<boolean>;
  isInterestCenterChoosen?: boolean;
  isRegisterProcessDone?: boolean;
  currentUserData?: Observable<User | undefined>;
  categoriesData?: Observable<Category[]>;
  isInitializing = false;
  opened?: boolean;
  mqObsever?: Observable<MediaChange>;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private uts: UtilitiesService
  ) {
    // informations de l'utilisateur connecté
    this.userID = this.route.snapshot.data.user.uid;
    this.userEmail = this.route.snapshot.data.user.email;
    this.isEmailVerified = this.route.snapshot.data.user.emailVerified;
    this.reloadUser = this.route.snapshot.data.user.reload();

    this.uts.isSideNavOpenned.forEach((isOpened) => (this.opened = isOpened));

    // observation du theme
    this.isDarkTheme = this.uts.observeDarkMode;

    // media query state
    this.mqObsever = this.uts.mediaQueryObserver();

    // données de l'utilisateur courrement connecté
    this.currentUserData = this.userService.getUser(this.userID);

    this.uts.createOnline$().forEach((isOnline) => {
      if (!isOnline) {
        this.uts.showNotification(
          `Connectez-vous sur l'internet pour voir les images et veillez ne pas ouvrir plusieurs onglets à la fois`,
          'Ok'
        );
      }
    });
  }

  ngOnInit(): void {
    // verification de la souscription aux centres d'interet
    this.userService
      .getInitialSubscription(this.userID)
      .forEach((interestCenter) => {
        interestCenter.length <= 1
          ? (this.isInterestCenterChoosen = false)
          : (this.isInterestCenterChoosen = true);

        // verification de la fin de process d'inscription
        this.isEmailVerified && this.isInterestCenterChoosen
          ? (this.isRegisterProcessDone = true)
          : (this.isRegisterProcessDone = false);
        this.isInitializing = true;
      });
  }

  // basculer entre les pages indexées sur la page Accueil
  onSwitchPages(index: number): void {
    this.indexPage = index;
    this.uts.isSideNavOpenned.next(false);
  }
}
