import { title } from './../../../../global_variables';
import { AuthService } from '../../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  resetPasswordForm = this.formBuilder.group({
    emailFormControl: ['', [Validators.required, Validators.email]],
  });

  get emailFormControl(): AbstractControl | null {
    return this.resetPasswordForm.get('emailFormControl');
  }

  ngOnInit(): void {}

  async onSubmit(): Promise<void> {
    if (this.resetPasswordForm.valid) {
      this.isValidForm = true;
      const email = this.resetPasswordForm.get('emailFormControl')?.value;
      try {
        await this.authService.resetPassword(email);
        this.dialog.closeAll();
        this.snackBar.open(
          `Un mail de reinitialisation de mot de passe a été envoyé avec succès sur ${email}`,
          '',
          {
            duration: 5000,
          }
        );
      } catch (error) {
        this.snackBar.open(`Une erreur s'est produite, ${error}`, 'Réessayer');
      }
    }
  }
}
