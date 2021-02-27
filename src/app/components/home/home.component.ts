import { title } from './../../../global_variables';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/database/category.service';
import { Category } from './../../models/category.model';
import { User } from './../../models/user.model';
import { UserService } from '../../services/database/user.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  title = title;
  indexPage = 0;
  isEmailVerified?: boolean;
  isInterestCenterChoosen?: boolean;
  isRegisterProcessDone?: boolean;
  currentUserData?: User;
  interestUserData?: Category[] = [];
  categoriesData: Category[] = [];
  copyCategories: Category[] = [];
  userEmail: string;
  userID: string;
  selectedItemCount = 0;
  isProgressBarShown = false;
  isInitializing = false;
  isNotRecommandedNumber = true;

  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.userID = this.route.snapshot.data.user.uid;
    this.userEmail = this.route.snapshot.data.user.email;
    this.isEmailVerified = this.route.snapshot.data.user.emailVerified;
    this.route.snapshot.data.user.reload();
  }

  ngOnInit(): void {
    // verification de la souscription aux centres d'interet
    this.userService
      .getInterestCenter(this.route.snapshot.data.user.uid)
      .subscribe(
        (interestCenter) => {
          interestCenter.length <= 1
            ? (this.isInterestCenterChoosen = false)
            : (this.isInterestCenterChoosen = true);

          // verification de la fin de process d'inscription
          this.isEmailVerified && this.isInterestCenterChoosen
            ? (this.isRegisterProcessDone = true)
            : (this.isRegisterProcessDone = false);
          this.isInitializing = true;
        },
        (error: any) => {
          this.snackBar.open(
            `Une erreur s'est produite, ${error}`,
            'Réessayer'
          );
        }
      );

    // données de l'utilisateur courrement connecté
    this.userService.getUser(this.userID).subscribe(
      (user) => {
        this.currentUserData = user;
      },
      (error: any) => {
        this.snackBar.open(`Une erreur s'est produite, ${error}`, 'Réessayer');
      }
    );

    // récuperation des categories disponible
    this.categoryService.getCategories().subscribe(
      (categories) => {
        this.categoriesData = categories;
      },
      (error: any) => {
        this.snackBar.open(`Une erreur s'est produite, ${error}`, 'Réessayer');
      }
    );
  }

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

  onAddInterestCenter(): void {
    this.isProgressBarShown = true;
    this.isNotRecommandedNumber = false;
    this.copyCategories.forEach(async (categorie) => {
      try {
        await this.userService.addInterestCenter(this.userID, categorie);
        this.isProgressBarShown = false;
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
        this.isProgressBarShown = false;
        this.isNotRecommandedNumber = false;
        this.snackBar.open(`Une erreur s'est produite, ${error}`, 'Réessayer');
      }
    });
  }

  // si l'email fournit est mauvais
  onWrongEmail = () => this.authService.logOut();

  // basculer entre les pages indexées sur la page Accueil
  onSwitchPages = (index: number) => (this.indexPage = index);
}
