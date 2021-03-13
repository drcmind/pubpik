import { Subscription } from 'rxjs';
import { UtilitiesService } from './../../services/utilities/utilities.service';
import { title } from './../../../global_variables';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/database/category.service';
import { Category } from './../../models/category.model';
import { User } from './../../models/user.model';
import { UserService } from '../../services/database/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaChange } from '@angular/flex-layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  title = title;
  indexPage = 0;
  isEmailVerified?: boolean;
  isInterestCenterChoosen?: boolean;
  isRegisterProcessDone?: boolean;
  currentUserData?: User;
  categoriesData: Category[] = [];
  userEmail: string;
  userID: string;
  isInitializing = false;
  opened?: boolean;
  activeViewPort?: string;
  mediaSubscription?: Subscription;
  reloadUser?: any;

  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private us: UtilitiesService
  ) {
    this.userID = this.route.snapshot.data.user.uid;
    this.userEmail = this.route.snapshot.data.user.email;
    this.isEmailVerified = this.route.snapshot.data.user.emailVerified;
    this.reloadUser = this.route.snapshot.data.user.reload();
    this.us.isSideNavOpenned.subscribe((isOpened) => (this.opened = isOpened));

    // media query state
    this.mediaSubscription = this.us
      .mediaQueryObserver()
      .subscribe(
        (change: MediaChange) => (this.activeViewPort = change.mqAlias)
      );
  }

  ngOnInit(): void {
    // données de l'utilisateur courrement connecté
    this.userService
      .getUser(this.userID)
      .subscribe((user) => (this.currentUserData = user));

    // récuperation des categories disponible
    this.categoryService
      .getCategories()
      .subscribe((categories) => (this.categoriesData = categories));

    // verification de la souscription aux centres d'interet
    this.userService
      .getInterestCenter(this.userID)
      .subscribe((interestCenter) => {
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

  ngOnDestroy = () => this.mediaSubscription?.unsubscribe();

  // basculer entre les pages indexées sur la page Accueil
  onSwitchPages = (index: number) => (this.indexPage = index);
}
