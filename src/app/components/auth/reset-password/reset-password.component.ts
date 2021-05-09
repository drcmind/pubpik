import { UtilitiesService } from 'src/app/services/utilities/utilities.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { title } from 'src/app/services/utilities/global_variables';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  title = title;
  isValidForm = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private uts: UtilitiesService,
    private dialog: MatDialog
  ) {}

  resetPasswordForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  get email(): AbstractControl | null {
    return this.resetPasswordForm.get('email');
  }

  ngOnInit(): void {}

  async onSubmit(): Promise<void> {
    if (this.resetPasswordForm.valid) {
      this.isValidForm = true;
      const email = this.resetPasswordForm.get('email')?.value;
      try {
        await this.authService.resetPassword(email);
        this.dialog.closeAll();
        this.uts.showNotification(
          `Un mail de reinitialisation de mot de passe a été envoyé avec succès sur ${email}`
        );
      } catch (error) {
        this.uts.showNotification(`Une erreur s'est produite, ${error}`);
      }
    }
  }
}
