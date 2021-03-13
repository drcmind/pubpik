import { Category } from './../../../../models/category.model';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { title } from 'src/global_variables';
import { UserService } from 'src/app/services/database/user.service';

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
  copyCategories: Category[] = [];
  @Input() userEmail?: string;
  @Input() userID: any;
  @Input() reloadUser: any;
  @Input() isEmailVerified?: boolean;
  @Input() currentUserData?: User;
  @Input() categoriesData: Category[] = [];
  @Input() isInterestCenterChoosen?: boolean;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private utilitiesService: UtilitiesService
  ) {}

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
    this.utilitiesService.refreshPage('');
    if (!this.isEmailVerified && this.currentUserData?.nom !== undefined) {
      this.snackBar.open(
        `Hey!, ${this.currentUserData?.nom}
            ${this.currentUserData?.postNom}.
             veillez confirmez d'abord votre adresse email,
              et puis réessayer`,
        'OK'
      );
    }
  }

  onAddInterestCenter(): void {
    this.isProgressBarVisible = true;
    this.isNotRecommandedNumber = false;
    this.copyCategories.forEach(async (categorie) => {
      try {
        await this.userService.addInterestCenter(this.userID, categorie);
        this.isProgressBarVisible = false;
        this.snackBar.open(
          `Salut ${this.currentUserData?.nom}
            ${this.currentUserData?.postNom}.
             Inscription terminée avec succès,
              Bienvenu sur ${this.title}`,
          '',
          {
            duration: 5000,
          }
        );
      } catch (error) {
        this.isProgressBarVisible = false;
        this.isNotRecommandedNumber = false;
        this.snackBar.open(`Une erreur s'est produite, ${error}`, 'Réessayer');
      }
    });
  }

  // si l'email fournit est mauvais
  onWrongEmail = () => this.authService.logOut();
}
