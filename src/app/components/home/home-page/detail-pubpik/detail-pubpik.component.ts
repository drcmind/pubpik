import { PubPik } from './../../../../models/pubpik.model';
import { DeleteDialogComponent } from './delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PubpikService } from './../../../../services/database/pubpik.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { MediaChange } from '@angular/flex-layout';
import { title } from 'src/app/services/utilities/global_variables';

@Component({
  selector: 'app-detail-pubpik',
  templateUrl: './detail-pubpik.component.html',
  styleUrls: ['./detail-pubpik.component.scss'],
})
export class DetailPubpikComponent implements OnInit {
  title = title;
  userID = '';
  imageIndex = 0;
  pubpikIdFromRoute?: string;
  pubpik?: Observable<PubPik | undefined>;
  relatedPubpik$?: Observable<PubPik[]>;
  mqObsever?: Observable<MediaChange>;
  isOnline$?: Observable<boolean>;
  isDarkTheme?: BehaviorSubject<boolean>;
  isImageLoading = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ps: PubpikService,
    private uts: UtilitiesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userID = this.route.snapshot.data.user.uid;

    this.isDarkTheme = this.uts.observeDarkMode;

    const routeParams = this.route.snapshot.paramMap;
    this.pubpikIdFromRoute = String(routeParams.get('pubpikId'));

    this.pubpik = this.ps.getSinglePubpik(this.pubpikIdFromRoute);

    this.mqObsever = this.uts.mediaQueryObserver();

    this.isOnline$ = this.uts.createOnline$();
  }

  showDialog(): void {
    this.dialog.open(DeleteDialogComponent, {
      width: '20rem',
      data: { pubpikID: this.pubpikIdFromRoute },
    });
  }

  prevImg(currentImg: string): void {
    this.isImageLoading = true;
    this.pubpik?.forEach((pub) => {
      pub?.pubpikImages.forEach((img) => {
        if (img === currentImg) {
          this.isImageLoading = false;
          this.imageIndex -= 1;
        }
      });
    });
  }

  nextImg(currentImg: string): void {
    this.isImageLoading = true;
    this.pubpik?.forEach((pub) => {
      pub?.pubpikImages.forEach((img) => {
        if (img === currentImg) {
          this.isImageLoading = false;
          this.imageIndex += 1;
        }
      });
    });
  }

  returnHome = () => this.router.navigate(['']);
}
