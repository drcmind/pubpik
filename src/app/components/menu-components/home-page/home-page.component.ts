import { UtilitiesService } from '../../../services/utilities.service';
import { UserService } from '../../../services/database/user.service';
import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { User } from 'src/app/models/user.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditInterestsCenterComponent } from './edit-interests-center/edit-interests-center.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PubpikService } from 'src/app/services/database/pubpik.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  userID = '';
  title: string;
  isInterestCenterLoading = true;
  userEmail?: string;
  interestCenters?: Promise<Category[]>;
  filterPubpik = new BehaviorSubject('');
  isDarkTheme?: BehaviorSubject<boolean>;
  currentUserData?: Observable<User | undefined>;
  constructor(
    private us: UserService,
    private uts: UtilitiesService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private ps: PubpikService,
    private router: Router
  ) {
    this.title = this.uts.title;
  }

  ngOnInit(): void {
    this.userID = this.route.snapshot.data.user.uid;
    this.userEmail = this.route.snapshot.data.user.email;

    // verification de la souscription aux centres d'interet
    this.us.getInitialSubscription(this.userID).subscribe((interestCenter) => {
      if (interestCenter.length <= 4 || !this.userEmail) {
        this.router.navigate(['emailAndSubscriptionVerification']);
      }
    });

    this.interestCenters = this.us.getInterestCenter(this.userID);

    this.isDarkTheme = this.uts.observeDarkMode;

    this.currentUserData = this.us.getUser(this.userID);

    this.loadInterestCenters();
  }

  async loadInterestCenters(): Promise<void> {
    await this.us.getInterestCenter(this.userID);
    this.isInterestCenterLoading = false;
  }

  refreshPage = () => this.uts.refreshPage('pubpik/accueil');

  onFilterByCategory = (category: string) => this.ps.onFilterPubpiks(category);

  editInterestsCenter(): void {
    this.dialog.open(EditInterestsCenterComponent, {
      width: '40rem',
      hasBackdrop: true,
      disableClose: true,
      data: { userID: this.userID, interestCenters: this.interestCenters },
    });
  }
}
