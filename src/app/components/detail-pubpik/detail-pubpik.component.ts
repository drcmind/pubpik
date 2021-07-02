import { PubPik } from '../../models/pubpik.model';
import { DeleteDialogComponent } from './delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PubpikService } from '../../services/database/pubpik.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { MediaChange } from '@angular/flex-layout';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detail-pubpik',
  templateUrl: './detail-pubpik.component.html',
  styleUrls: ['./detail-pubpik.component.scss'],
})
export class DetailPubpikComponent implements OnInit {
  title: string;
  userID = '';
  imageIndex = 0;
  pubpikIdFromRoute?: string;
  pubpik?: Observable<PubPik | undefined>;
  relatedPubpik$?: Observable<PubPik[]>;
  isOnline$?: Observable<boolean>;
  isDarkTheme?: BehaviorSubject<boolean>;
  isImageLoading = true;
  currentImg?: string;
  constructor(
    private route: ActivatedRoute,
    private ps: PubpikService,
    private uts: UtilitiesService,
    private dialog: MatDialog,
    private location: Location
  ) {
    this.title = this.uts.title;
  }

  ngOnInit(): void {
    this.userID = this.route.snapshot.data.user.uid;

    this.isDarkTheme = this.uts.observeDarkMode;

    const routeParams = this.route.snapshot.paramMap;
    this.pubpikIdFromRoute = String(routeParams.get('pubpikId'));
    this.pubpik = this.ps.getSinglePubpik(this.pubpikIdFromRoute);

    this.pubpik.subscribe((pubpik) => {
      this.currentImg = pubpik?.pubpikImages[0];
      this.isImageLoading = false;
    });

    this.isOnline$ = this.uts.createOnline$();
  }

  showDialog(): void {
    this.dialog.open(DeleteDialogComponent, {
      width: '20rem',
      data: { pubpikID: this.pubpikIdFromRoute },
    });
  }

  prevImg(): void {
    this.isImageLoading = true;
    this.pubpik?.subscribe((pub) => {
      this.currentImg = pub?.pubpikImages[(this.imageIndex -= 1)];
      this.isImageLoading = false;
    });
  }

  nextImg(): void {
    this.isImageLoading = true;
    this.pubpik?.subscribe((pub) => {
      if (!(this.imageIndex === pub?.pubpikImages?.length! - 1)) {
        this.currentImg = pub?.pubpikImages[(this.imageIndex += 1)];
        this.isImageLoading = false;
      }
    });
  }

  goBack = () => this.location.back();
}
