import { UtilitiesService } from './../../services/utilities/utilities.service';
import { Component, Input, OnInit } from '@angular/core';
import { PubPik } from 'src/app/models/pubpik.model';
import { FavoritePubpikService } from 'src/app/services/database/favorite-pubpik.service';

@Component({
  selector: 'app-pubpik-feed',
  template: `
    <mat-grid-list
      [cols]="
        activeViewPort === 'lg' || activeViewPort === 'md'
          ? 3
          : activeViewPort === 'sm'
          ? 2
          : 2
      "
      [rowHeight]="
        activeViewPort === 'sm'
          ? '30rem'
          : activeViewPort === 'xs'
          ? '20rem'
          : '17rem'
      "
      gutterSize="1rem"
    >
      <mat-grid-tile
        *ngFor="let pubpik of pubpiksResult; let i = index"
        [style.background]="pubpik.pubpikCategory.categoryColor"
        [rowspan]="
          (activeViewPort === 'lg' && i % 3 === 1) ||
          (activeViewPort === 'md' && i % 3 === 1)
            ? 2
            : 1
        "
        [colspan]="
          (activeViewPort === 'lg' && i % 2 === 0) ||
          (activeViewPort === 'md' && i % 2 === 0)
            ? 1
            : 2
        "
      >
        <div
          class="bac-img"
          [style.background-image]="'url(' + pubpik.pubpikImages[0] + ')'"
        >
          <div
            class="bac-img-hover"
            fxLayout="column"
            fxLayoutAlign="space-between"
          >
            <button
              *ngIf="!pubpik.isFavoriteCount"
              mat-flat-button
              matTooltip="Ajouter aux favoris"
              fxFlexAlign="end"
              (click)="
                onAddFavoritePubik(pubpik, userID, pubpik.pubpikFavoriteCount)
              "
            >
              <span *ngIf="pubpik.pubpikFavoriteCount !== 0">
                {{ pubpik.pubpikFavoriteCount }}
              </span>
              <mat-icon>favorite</mat-icon>
            </button>
            <button
              *ngIf="pubpik.isFavoriteCount"
              mat-flat-button
              matTooltip="Rétirer de favoris"
              fxFlexAlign="end"
              color="warn"
              (click)="
                onRemoveFavoritePubik(
                  pubpik,
                  userID,
                  pubpik.pubpikFavoriteCount
                )
              "
            >
              <span>{{ pubpik.pubpikFavoriteCount }} </span>
              <mat-icon>favorite</mat-icon>
            </button>
            <div
              class="pubpik"
              fxLayout="row"
              (click)="goToDetailPubpik(pubpik.pubpikId)"
            >
              <div
                class="pubpik-profil-img"
                [style.background]="pubpik.pubpikCategory.categoryColor"
              >
                <img
                  class="profile-img"
                  *ngIf="pubpik.pubpikUserData.imgProfil !== ''"
                  [src]="pubpik.pubpikUserData.imgProfil"
                  alt=""
                />
                <div
                  class="profile-img"
                  *ngIf="pubpik.pubpikUserData.imgProfil === ''"
                  fxLayout="column"
                >
                  <h1 class="profile-text" fxFlexAlign="center">
                    {{ pubpik.pubpikUserData.nom[0] }}
                  </h1>
                </div>
              </div>
              <div class="pubpik-text">
                <h1>
                  <strong>{{ pubpik.pubpikCategory.categoryName }}: </strong>
                  {{ pubpik.pubpikTitle }}
                </h1>
                <h3>
                  {{ pubpik.pubpikUserData.nom }}
                  {{ pubpik.pubpikUserData.postNom }}
                </h3>
                <h4>
                  {{ pubpik.pubpikTimestamp.toDate() | date }}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </mat-grid-tile>
    </mat-grid-list>
  `,
  styleUrls: ['./pubpik-feed.component.scss'],
})
export class PubpikFeedComponent implements OnInit {
  @Input() pubpiksResult = new Set<PubPik>();
  @Input() activeViewPort?: string;
  @Input() userID?: string;
  pubpik?: PubPik;
  constructor(
    private us: UtilitiesService,
    private fps: FavoritePubpikService
  ) {}

  ngOnInit(): void {}

  goToDetailPubpik(pubpikID: string): void {
    this.us.refreshPage(`pubpik/${pubpikID}`);
  }

  onAddFavoritePubik(
    pubpik: PubPik,
    userID: string,
    pubpikFavoriteCount: number
  ): void {
    pubpik.pubpikFavoriteCount += 1;
    pubpik.isFavoriteCount = true;
    this.fps.addFavorite(pubpik, userID, pubpikFavoriteCount);
  }

  onRemoveFavoritePubik(
    pubpik: PubPik,
    userID: string,
    pubpikFavoriteCount: number
  ): void {
    pubpik.pubpikFavoriteCount -= 1;
    pubpik.isFavoriteCount = false;
    this.fps.removeFavorite(pubpik, userID, pubpikFavoriteCount);
  }
}
