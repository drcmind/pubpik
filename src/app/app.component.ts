import { AuthService } from './services/auth/auth.service';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from './models/user.model';
import { UserService } from './services/database/user.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  currentUserData?: Observable<User | undefined>;
  opened?: boolean;
  isDarkTheme?: BehaviorSubject<boolean>;
  constructor(
    private uts: UtilitiesService,
    private afAuth: AngularFireAuth,
    private us: UserService
  ) {
    // toogle side menu
    this.uts.isSideNavOpenned.forEach((isOpened) => (this.opened = isOpened));

    // observation du theme
    this.isDarkTheme = this.uts.observeDarkMode;

    // données de l'utilisateur courrement connecté
    this.afAuth.user.forEach((user) => {
      this.currentUserData = this.us.getUser(user?.uid);
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
