import { UtilitiesService } from '../../../services/utilities/utilities.service';
import { Category } from 'src/app/models/category.model';
import { Observable } from 'rxjs';
import { CategoryService } from '../../../services/database/category.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/database/user.service';
import { BehaviorSubject } from 'rxjs';
import { title } from 'src/app/services/utilities/global_variables';
import { ActivatedRoute, Router } from '@angular/router';

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
  interestCenter$?: Observable<Category[]>;
  copyCategories: Category[] = [];
  isDarkTheme?: BehaviorSubject<boolean>;
  userEmail?: string;
  userID = '';
  isEmailVerified?: BehaviorSubject<boolean>;

  constructor(
    private us: UserService,
    private authService: AuthService,
    private uts: UtilitiesService,
    private categoriesService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.interestCenter$ = this.categoriesService.getCategories();
    this.userID = this.route.snapshot.data.user.uid;
    this.userEmail = this.route.snapshot.data.user.email;
    this.isEmailVerified = new BehaviorSubject(
      this.route.snapshot.data.user.emailVerified
    );
    this.isDarkTheme = this.uts.observeDarkMode;
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

  async onReloadUser(): Promise<void> {
    this.isProgressBarVisible = true;
    await this.route.snapshot.data.user.reload();
    this.isEmailVerified?.next(this.route.snapshot.data.user.emailVerified);
    this.isProgressBarVisible = false;
  }

  onAddInterestCenter(): void {
    this.isProgressBarVisible = true;
    this.isNotRecommandedNumber = false;
    this.copyCategories.forEach(async (categorie) => {
      await this.us.setInterestCenter(this.userID, categorie);
      this.router.navigate(['pubpik/accueil']);
    });
    this.uts.showNotification(
      `Inscription terminée avec succès, Bienvenu sur ${this.title}`
    );
  }

  // si l'email fournit est mauvais
  onWrongEmail = () => this.authService.logOut();
}
