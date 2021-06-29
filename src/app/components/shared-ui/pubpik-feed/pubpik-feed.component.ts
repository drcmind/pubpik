import { PubPik } from './../../../models/pubpik.model';
import { BehaviorSubject } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { FavoritePubpikService } from 'src/app/services/database/favorite-pubpik.service';
import { Category } from 'src/app/models/category.model';
import { Router } from '@angular/router';
import { PubpikService } from 'src/app/services/database/pubpik.service';
import { Observable } from 'rxjs';
import { MediaChange } from '@angular/flex-layout';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-pubpik-feed',
  templateUrl: './pubpik-feed.component.html',
  styleUrls: ['./pubpik-feed.component.scss'],
})
export class PubpikFeedComponent implements OnInit {
  @Input() height?: string;
  @Input() pageName = '';
  @Input() userID = '';
  @Input() userPubpikStatus = '';
  @Input() pubpik?: Observable<PubPik | undefined>;
  @Input() interestCenters?: Promise<Category[]>;
  @Input() isDarkTheme?: BehaviorSubject<boolean>;
  isPubPikLoading = true;
  pubpiks = new Array<PubPik>();
  mqObsever?: Observable<MediaChange>;

  constructor(
    private fps: FavoritePubpikService,
    private router: Router,
    private ps: PubpikService,
    private uts: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.mqObsever = this.uts.mediaQueryObserver();

    if (this.pageName === 'accueil') {
      this.getPubpiksByCategories(this.userID);
    } else if (this.pubpik !== undefined) {
      this.getRelatedPubPiks(this.userID);
    } else if (
      this.pageName === 'profile' &&
      this.userPubpikStatus === 'isMyPubpiks'
    ) {
      this.getUserPubPiks(this.userID);
    } else if (
      this.pageName === 'profile' &&
      this.userPubpikStatus === 'isMyFavorites'
    ) {
      this.getUserFavoritePubpiks(this.userID);
    } else {
      this.getPubPiks(this.userID);
    }
  }

  async getPubPiks(userID: string): Promise<void> {
    this.pubpiks = await this.ps.getPubPiks();
    this.pubpiks.forEach((pub) => this.fps.isFavoritePubpik(pub, userID));
    this.isPubPikLoading = false;
  }

  async getPubpiksByCategories(userID: string): Promise<void> {
    const queryInterestCenters = await this.interestCenters;
    const queryPubPiks = await this.ps.getPubPiks();
    queryInterestCenters?.forEach((ic) => {
      queryPubPiks.forEach((pubpik) => {
        if (pubpik.pubpikCategory.categoryName === ic.categoryName) {
          this.fps.isFavoritePubpik(pubpik, userID);
          this.pubpiks.push(pubpik);
          this.pubpiks.sort(() => 0.3 - Math.random());
          this.getFilterPubpiks(this.pubpiks);
          this.isPubPikLoading = false;
        }
      });
    });
  }

  getFilterPubpiks(pubpiks: PubPik[]): void {
    this.ps.filterPubpik.subscribe(async (filter) => {
      if (filter && filter !== 'toutes') {
        this.pubpiks = pubpiks.filter((pub) => {
          return pub.pubpikCategory.categoryName === filter;
        });
      } else if (filter === 'toutes') {
        this.pubpiks = pubpiks;
      }
    });
  }

  async getRelatedPubPiks(userID: string): Promise<void> {
    const queryPubPiks = await this.ps.getPubPiks();
    this.pubpik?.forEach((pubpik) => {
      const notRelatedPubpik = (pub: PubPik) => {
        const categorieA = pub.pubpikCategory.categoryName;
        const categorieB = pubpik?.pubpikCategory.categoryName;
        this.fps.isFavoritePubpik(pub, userID);
        return categorieA === categorieB;
      };
      this.pubpiks = queryPubPiks.filter(notRelatedPubpik);
      this.isPubPikLoading = false;
    });
  }

  async getUserPubPiks(userID: string): Promise<void> {
    const queryPubPiks = await this.ps.getPubPiks();
    const notUserPubpiks = (pub: PubPik) => {
      this.fps.isFavoritePubpik(pub, userID);
      return pub.pubpikUserData?.id === userID;
    };
    this.pubpiks = queryPubPiks.filter(notUserPubpiks);
    this.isPubPikLoading = false;
  }

  async getUserFavoritePubpiks(userID: string): Promise<void> {
    this.pubpiks = await this.fps.getUserFavoritePubpiks(userID);
    this.pubpiks.forEach((pub) => this.fps.isFavoritePubpik(pub, userID));
    this.isPubPikLoading = false;
  }

  onAddFavoritePubik(pubpik: PubPik, userID: string): void {
    const pubpikFavoriteCount = (pubpik.pubpikFavoriteCount += 1);
    pubpik.isMyFavorite = true;
    this.fps.addFavorite(pubpik, userID, pubpikFavoriteCount);
  }

  onRemoveFavoritePubik(pubpik: PubPik, userID: string): void {
    const pubpikFavoriteCount = (pubpik.pubpikFavoriteCount -= 1);
    pubpik.isMyFavorite = false;
    this.fps.removeFavorite(pubpik, userID, pubpikFavoriteCount);
  }

  goToDetailPubpik(pubpikID?: string): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.navigate(['pubpik-detail', pubpikID]);
  }
}
