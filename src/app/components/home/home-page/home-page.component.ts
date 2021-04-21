import { UtilitiesService } from './../../../services/utilities/utilities.service';
import { UserService } from './../../../services/database/user.service';
import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { User } from 'src/app/models/user.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditInterestsCenterComponent } from './edit-interests-center/edit-interests-center.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  isInterestCenterLoading = true;
  interestCenters?: Promise<Category[]>;
  filterPubpik = new BehaviorSubject('');
  @Input() title?: string;
  @Input() activeViewPort?: string;
  @Input() isDarkTheme?: BehaviorSubject<boolean>;
  @Input() userID = '';
  @Input() currentUserData?: Observable<User | undefined>;
  constructor(
    private us: UserService,
    private uts: UtilitiesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.interestCenters = this.us.getInterestCenter(this.userID);
    this.loadInterestCenters();
  }

  async loadInterestCenters(): Promise<void> {
    await this.us.getInterestCenter(this.userID);
    this.isInterestCenterLoading = false;
  }

  refreshPage = () => this.uts.refreshPage('');

  onFilterByCategory = (category: string) => this.filterPubpik.next(category);

  editInterestsCenter(): void {
    this.dialog.open(EditInterestsCenterComponent, {
      width: '40rem',
      hasBackdrop: true,
      disableClose: true,
      data: { userID: this.userID, interestCenters: this.interestCenters },
    });
  }
}
