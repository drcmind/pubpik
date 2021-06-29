import { UtilitiesService } from '../../../../services/utilities.service';
import { UserService } from '../../../../services/database/user.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/database/category.service';

@Component({
  selector: 'app-edit-interests-center',
  templateUrl: './edit-interests-center.component.html',
  styleUrls: ['./edit-interests-center.component.scss'],
})
export class EditInterestsCenterComponent implements OnInit {
  interestCenters?: Category[];
  userInterestCenters: Category[] = [];
  isNotRecommandedNumber?: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { userID: string; interestCenters: Promise<Category[]> },
    private cs: CategoryService,
    private userService: UserService,
    private dialog: MatDialog,
    private uts: UtilitiesService
  ) {
    this.cs.getCategories().subscribe((interestCenters) => {
      this.interestCenters = interestCenters;
      this.interestCenters.forEach(async (icGlobal) => {
        this.userInterestCenters = await this.data.interestCenters;

        this.userInterestCenters.forEach((userIC) => {
          if (icGlobal.categoryName === userIC.categoryName) {
            icGlobal.isMyCategory = true;
          }
        });
      });
    });
  }

  onInterestCenterselected(category: Category, checked: boolean): void {
    if (checked) {
      this.userService.setInterestCenter(this.data.userID, category);
      this.userInterestCenters.push(category);
      this.userInterestCenters.length > 4
        ? (this.isNotRecommandedNumber = false)
        : (this.isNotRecommandedNumber = true);
    } else {
      this.userInterestCenters = this.userInterestCenters.filter(
        (filterCategory) => {
          return category.categoryName !== filterCategory.categoryName;
        }
      );
      this.userInterestCenters.length > 4
        ? (this.isNotRecommandedNumber = false)
        : (this.isNotRecommandedNumber = true);
      if (this.userInterestCenters.length > 1) {
        this.userService.deleteInterestCenter(this.data.userID, category);
      }
    }
  }

  onEditInterestCenter(): void {
    this.dialog.closeAll();
    this.uts.refreshPage('pubpik/accueil');
  }

  ngOnInit(): void {}
}
