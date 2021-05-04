import { UtilitiesService } from './../../../../services/utilities/utilities.service';
import { Category } from 'src/app/models/category.model';
import { Observable } from 'rxjs';
import { CategoryService } from './../../../../services/database/category.service';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/database/user.service';
import { BehaviorSubject } from 'rxjs';
import { title } from 'src/app/services/utilities/global_variables';

@Component({
  selector: 'app-process-register',
  templateUrl: './process-register.component.html',
  styleUrls: ['./process-register.component.scss'],
})
export class ProcessRegisterComponent implements OnInit {
  title = title;
  selectedItemCount = 0;
  isProgressBarVisible = false;
  isNotRecommandedNumber = true;
  interestCenter$: Observable<Category[]>;
  copyCategories: Category[] = [];
  @Input() isDarkTheme?: BehaviorSubject<boolean>;
  @Input() userEmail?: string;
  @Input() userID: any;
  @Input() reloadUser: any;
  @Input() isEmailVerified?: boolean;
  @Input() currentUserData?: User | null;
  @Input() isInterestCenterChoosen?: boolean;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private uts: UtilitiesService,
    private categoriesService: CategoryService
  ) {
    this.interestCenter$ = this.categoriesService.getCategories();
  }

  ngOnInit(): void {}

  onInterestCenterselected(category: Category, checked: boolean): void {
    if (checked) {
      this.copyCategories.push(category);
      this.copyCategories.length > 4
        ? (this.isNotRecommandedNumber = false)
        : (this.isNotRecommandedNumber = true);

      this.selectedItemCount = this.copyCategories.length;
    } else {
      const filterCopyCategories = this.copyCategories.filter(
        (filterCategory) => {
          return category.id !== filterCategory.id;
        }
      );

      this.copyCategories = filterCopyCategories;
      this.copyCategories.length > 4
        ? (this.isNotRecommandedNumber = false)
        : (this.isNotRecommandedNumber = true);
      this.selectedItemCount = this.copyCategories.length;
    }
  }

  reloadThisUser = () => this.reloadUser;

  onReloadPage(): void {
    this.reloadThisUser();
    this.uts.refreshPage('');
    if (!this.isEmailVerified && this.currentUserData?.nom !== undefined) {
      this.uts.showNotification(
        `Hey!, ${this.currentUserData?.nom} ${this.currentUserData?.postNom}. veillez confirmez d'abord votre adresse email, et puis réessayer`
      );
    }
  }

  onAddInterestCenter(): void {
    this.isProgressBarVisible = true;
    this.isNotRecommandedNumber = false;
    this.copyCategories.forEach(async (categorie) => {
      await this.userService.setInterestCenter(this.userID, categorie);
      this.isProgressBarVisible = false;
      this.uts.showNotification(
        `Salut ${this.currentUserData?.nom} ${this.currentUserData?.postNom}. Inscription terminée avec succès, Bienvenu sur ${this.title}`
      );
    });
  }

  // si l'email fournit est mauvais
  onWrongEmail = () => this.authService.logOut();
}
