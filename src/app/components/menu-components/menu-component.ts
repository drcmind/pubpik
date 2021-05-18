import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/database/user.service';
import { UtilitiesService } from 'src/app/services/utilities/utilities.service';

@Component({
  selector: 'app-menu-components',
  templateUrl: './menu-component.html',
  styleUrls: ['./menu-component.scss'],
})
export class MenuComponentsComponent implements OnInit {
  currentUserData?: Observable<User | undefined>;
  opened?: boolean;
  isDarkTheme?: BehaviorSubject<boolean>;
  userID = '';
  constructor(
    private uts: UtilitiesService,
    private us: UserService,
    private route: ActivatedRoute
  ) {
    this.userID = this.route.snapshot.data.user.uid;

    // toogle side menu
    this.uts.isSideNavOpenned.forEach((isOpened) => (this.opened = isOpened));

    // observation du theme
    this.isDarkTheme = this.uts.observeDarkMode;

    // données de l'utilisateur courrement connecté
    this.currentUserData = this.us.getUser(this.userID);
  }

  ngOnInit(): void {}
}
