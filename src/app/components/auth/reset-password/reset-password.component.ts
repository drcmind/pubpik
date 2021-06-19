import { UtilitiesService } from 'src/app/services/utilities.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  title: string;
  isValidForm = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private uts: UtilitiesService,
    private dialog: MatDialog
  ) {
    this.title = this.uts.title;
  }

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
        this.isValidForm = true;
        this.uts.showNotification(`Une erreur s'est produite, ${error}`);
      }
    }
  }
}
