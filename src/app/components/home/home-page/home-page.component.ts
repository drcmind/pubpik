import { Router } from '@angular/router';
import { FavoritePubpikService } from './../../../services/database/favorite-pubpik.service';
import { MediaChange } from '@angular/flex-layout';
import { UtilitiesService } from './../../../services/utilities/utilities.service';
import { UserService } from './../../../services/database/user.service';
import { PubpikService } from './../../../services/database/pubpik.service';
import { PubPik } from './../../../models/pubpik.model';
import { title } from './../../../../global_variables';
import { MatDialog } from '@angular/material/dialog';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { AddPubPikComponent } from './add-pub-pik/add-pub-pik.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  title = title;
  isMyFavoritePubPik?: boolean;
  @Input() categories: Category[] = [];
  @Input() userData: User = {};
  interestCenters: Category[] = [];
  pubpiks: PubPik[] = [];
  pubpiksResult = new Set<PubPik>();
  activeViewPort?: string;
  mediaSubscription?: Subscription;
  constructor(
    private dialog: MatDialog,
    private pubpikService: PubpikService,
    private userService: UserService,
    private us: UtilitiesService,
    private fps: FavoritePubpikService
  ) {}

  ngOnInit(): void {
    // media query state
    /*   (change: MediaChange) => (this.activeViewPort = change.mqAlias); */
    this.mediaSubscription = this.us
      .mediaQueryObserver()
      .subscribe(
        (change: MediaChange) => (this.activeViewPort = change.mqAlias)
      );

    // récuperation de tous les pubpiks
    this.pubpikService
      .getPubPiks()
      ?.subscribe((pubpiks) => (this.pubpiks = pubpiks));

    // récuperation de toutes les categories de l'utilisateur connecté
    this.userService
      .getInterestCenter(this.userData.id)
      .subscribe((interestCenters) => {
        this.interestCenters = interestCenters;
        this.interestCenters.forEach((interest) => {
          this.pubpiks.forEach((pubpik) => {
            // récuperation des pubpiks selon les centres d'interet de l'utilisateur
            if (pubpik.pubpikCategory.categoryName === interest.categoryName) {
              this.pubpiksResult.add(pubpik);
              this.fps
                .favoritePubpikDoc(pubpik.pubpikId, this.userData.id)
                .subscribe((doc) =>
                  doc.exists
                    ? (pubpik.isFavoriteCount = true)
                    : (pubpik.isFavoriteCount = false)
                );
            }
          });
        });
      });
  }

  ngOnDestroy = () => this.mediaSubscription?.unsubscribe();

  toggleMenu = () => this.us.toogleSidenav();

  refreshPage = () => this.us.refreshPage('');

  openAddPubPikDialog(): void {
    this.dialog.open(AddPubPikComponent, {
      width: '30rem',
      hasBackdrop: true,
      disableClose: true,
      data: { categoriesData: this.interestCenters, userData: this.userData },
    });
  }

  onFilterCategory(categoryName: string): void {
    this.pubpiksResult.clear();
    this.pubpikService
      .getFilterPubPiks(categoryName)
      ?.subscribe(
        (filterPubpiks) => (this.pubpiksResult = new Set<PubPik>(filterPubpiks))
      );
  }
}
