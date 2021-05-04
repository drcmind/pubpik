import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { PubPik } from './../../../models/pubpik.model';
import { BehaviorSubject } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { FavoritePubpikService } from 'src/app/services/database/favorite-pubpik.service';
import { Category } from 'src/app/models/category.model';
import { Router } from '@angular/router';
import { PubpikService } from 'src/app/services/database/pubpik.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pubpik-feed',
  templateUrl: './pubpik-feed.component.html',
  styleUrls: ['./pubpik-feed.component.scss'],
})
export class PubpikFeedComponent implements OnInit {
  isPubPikLoading = true;
  @Input() pageName = '';
  @Input() userID = '';
  @Input() userPubpikStatus = '';
  @Input() activeViewPort?: string;
  @Input() pubpik?: Observable<PubPik | undefined>;
  @Input() interestCenters?: Promise<Category[]>;
  @Input() isDarkTheme?: BehaviorSubject<boolean>;
  @Input() filterPubpik?: BehaviorSubject<string>;
  pubpiks = new Set<PubPik>();

  constructor(
    private fps: FavoritePubpikService,
    private uts: UtilitiesService,
    private router: Router,
    private ps: PubpikService
  ) {}

  ngOnInit(): void {
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
    const pubPiks = await this.ps.getPubPiks();
    this.pubpiks = new Set(pubPiks);
    this.isPubPikLoading = false;
    pubPiks.forEach((pub) => this.fps.isFavoritePubpik(pub, userID));
  }

  async getPubpiksByCategories(userID: string): Promise<void> {
    const queryInterestCenters = await this.interestCenters;
    const queryPubPiks = await this.ps.getPubPiks();
    queryInterestCenters?.forEach((ic) => {
      queryPubPiks.forEach((pubpik) => {
        if (pubpik.pubpikCategory.categoryName === ic.categoryName) {
          this.fps.isFavoritePubpik(pubpik, userID);
          this.pubpiks.add(pubpik);
          this.getFilterPubpiks([...this.pubpiks]);
          this.isPubPikLoading = false;
        }
      });
    });
  }

  getFilterPubpiks(pubpiks: PubPik[]): void {
    this.filterPubpik?.forEach(async (filtering) => {
      if (filtering && filtering !== 'toutes') {
        this.pubpiks = new Set(
          pubpiks.filter((pub) => {
            return pub.pubpikCategory.categoryName === filtering;
          })
        );
      } else if (filtering === 'toutes') {
        this.pubpiks = new Set(pubpiks);
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
      const relatedPubpiks = queryPubPiks.filter(notRelatedPubpik);
      this.pubpiks = new Set(relatedPubpiks);
      this.isPubPikLoading = false;
    });
  }

  async getUserPubPiks(userID: string): Promise<void> {
    const queryPubPiks = await this.ps.getPubPiks();
    const notUserPubpiks = (pub: PubPik) => {
      this.fps.isFavoritePubpik(pub, userID);
      return pub.pubpikUserData.id === userID;
    };
    const userPubpiks = queryPubPiks.filter(notUserPubpiks);
    this.pubpiks = new Set(userPubpiks);
    this.isPubPikLoading = false;
  }

  async getUserFavoritePubpiks(userID: string): Promise<void> {
    const userFPs = await this.fps.getUserFavoritePubpiks(userID);
    this.pubpiks = new Set(userFPs);
    this.isPubPikLoading = false;
    userFPs.forEach((pub) => this.fps.isFavoritePubpik(pub, userID));
  }

  goToDetailPubpik(pubpikID?: string): void {
    if (this.pageName === 'detail-pubpik') {
      this.uts.refreshPage(`pubpik/${pubpikID}`);
    } else {
      this.router.navigate(['pubpik', pubpikID]);
    }
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
}
