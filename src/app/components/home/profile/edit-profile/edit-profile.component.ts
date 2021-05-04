import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MediaChange } from '@angular/flex-layout';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/database/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  fxLayoutAlign = 'center center';
  fontSize = '4rem';
  isImageLoading = false;
  isDarkTheme?: BehaviorSubject<boolean>;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isDarkTheme?: BehaviorSubject<boolean>;
      userData: User;
      currentUserData?: Observable<User | undefined>;
    },
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    private us: UserService,
    private dialog: MatDialog
  ) {
    this.isDarkTheme = this.data.isDarkTheme;
  }

  editUserForm = this.formBuilder.group({
    firstName: [this.data.userData.nom, Validators.required],
    lastName: [this.data.userData.postNom],
    email: [this.data.userData.email, [Validators.required, Validators.email]],
  });

  get firstName(): AbstractControl | null {
    return this.editUserForm.get('firstName');
  }

  get lastName(): AbstractControl | null {
    return this.editUserForm.get('lastName');
  }

  get email(): AbstractControl | null {
    return this.editUserForm.get('email');
  }

  async selectFile(event: any): Promise<void> {
    if (event.target.files) {
      this.isImageLoading = true;
      for (let i = 0; i < File.length; i++) {
        const file = event.target.files[i];
        const filePath = `pubpik/${Date.now()}_${file.name}`;
        const task = this.storage.upload(filePath, file);
        const uploadTaskSnapshot = await task;
        const url = await uploadTaskSnapshot.ref.getDownloadURL();
        await this.us.updateUserProfileImg(url, this.data.userData.id);
        this.isImageLoading = false;
      }
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.editUserForm.valid) {
      const userInfo: User = {
        nom: this.editUserForm.get('firstName')?.value,
        postNom: this.editUserForm.get('lastName')?.value,
        email: this.editUserForm.get('email')?.value,
      };
      this.us.updateUserProfilInfo(userInfo, this.data.userData.id);
      this.dialog.closeAll();
    }
  }
}
