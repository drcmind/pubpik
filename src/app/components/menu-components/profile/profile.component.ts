import { MediaChange } from '@angular/flex-layout';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { User } from 'src/app/models/user.model';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/database/user.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  title: string;
  userID = '';
  isDarkTheme?: BehaviorSubject<boolean>;
  currentUserData?: Observable<User | undefined>;
  userData?: User | null;
  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private route: ActivatedRoute,
    private us: UserService,
    private uts: UtilitiesService
  ) {
    this.title = this.uts.title;
  }

  ngOnInit(): void {
    this.userID = this.route.snapshot.data.user.uid;

    this.isDarkTheme = this.uts.observeDarkMode;

    this.currentUserData = this.us.getUser(this.userID);

    this.currentUserData.forEach((user) => (this.userData = user));
  }

  editUserDialog(): void {
    this.dialog.open(EditProfileComponent, {
      width: '40rem',
      data: {
        isDarkTheme: this.isDarkTheme,
        userData: this.userData,
      },
    });
  }

  deconnexion = () => this.authService.logOut();
}
