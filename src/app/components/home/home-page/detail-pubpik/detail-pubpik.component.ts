import { PubpikService } from './../../../../services/database/pubpik.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PubPik } from 'src/app/models/pubpik.model';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { MediaChange } from '@angular/flex-layout';
import { FavoritePubpikService } from 'src/app/services/database/favorite-pubpik.service';

@Component({
  selector: 'app-detail-pubpik',
  templateUrl: './detail-pubpik.component.html',
  styleUrls: ['./detail-pubpik.component.scss'],
})
export class DetailPubpikComponent implements OnInit, OnDestroy {
  pubpik: any = {};
  relatedPubpiks?: PubPik[];
  activeViewPort?: string;
  mediaSubscription?: Subscription;
  userID?: string;
  constructor(
    private route: ActivatedRoute,
    private pubpikService: PubpikService,
    private us: UtilitiesService,
    private fps: FavoritePubpikService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // First get the product id from the current route.
    this.userID = this.route.snapshot.data.user.uid;

    const routeParams = this.route.snapshot.paramMap;
    const pubpikIdFromRoute = routeParams.get('pubpikId');

    this.pubpikService
      .getSinglePubpik(pubpikIdFromRoute)
      .subscribe((singlePubpik) => {
        this.pubpik = singlePubpik;
        this.pubpikService
          .getFilterPubPiks(singlePubpik?.pubpikCategory.categoryName)
          .subscribe((pubpiks) => {
            this.relatedPubpiks = pubpiks;
            this.relatedPubpiks.forEach((favoritePubpik) => {
              this.fps
                .favoritePubpikDoc(favoritePubpik.pubpikId, this.userID)
                .subscribe((doc) =>
                  doc.exists
                    ? (favoritePubpik.isFavoriteCount = true)
                    : (favoritePubpik.isFavoriteCount = false)
                );
            });
          });
      });

    this.mediaSubscription = this.us
      .mediaQueryObserver()
      .subscribe(
        (change: MediaChange) => (this.activeViewPort = change.mqAlias)
      );
  }

  returnHome = () => this.router.navigate([{ outlets: { popup: null } }]);
  ngOnDestroy = () => this.mediaSubscription?.unsubscribe();
}
