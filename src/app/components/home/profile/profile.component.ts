import { MediaChange } from '@angular/flex-layout';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { User } from 'src/app/models/user.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @Input() title?: string;
  @Input() userID = '';
  @Input() activeViewPort?: string;
  @Input() isDarkTheme?: BehaviorSubject<boolean>;
  @Input() currentUserData?: Observable<User | undefined>;
  @Input() userData?: User | null;
  constructor(private dialog: MatDialog, private authService: AuthService) {}

  ngOnInit(): void {}

  editUserDialog(): void {
    this.dialog.open(EditProfileComponent, {
      width: '40rem',
      data: {
        isDarkTheme: this.isDarkTheme,
        userData: this.userData,
        currentUserData: this.currentUserData,
      },
    });
  }

  deconnexion = () => this.authService.logOut();
}
