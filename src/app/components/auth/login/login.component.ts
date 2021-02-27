import { ResetPasswordComponent } from './../reset-password/reset-password.component';
import { AuthService } from '../../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { desc, title } from 'src/global_variables';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isHide = true;
  formValid = false;
  title = title;
  desc = desc;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  loginForm = this.formBuilder.group({
    emailFormControl: ['', [Validators.required, Validators.email]],
    passwordFormControl: [
      '',
      [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)],
    ],
  });

  get emailFormControl(): AbstractControl | null {
    return this.loginForm.get('emailFormControl');
  }

  get passwordFormControl(): AbstractControl | null {
    return this.loginForm.get('passwordFormControl');
  }

  ngOnInit(): void {}

  goToRegister(): void {
    this.dialog.closeAll();
    this.router.navigate(['/register']);
  }

  openResetPasswordDialog(): void {
    this.dialog.closeAll();
    this.dialog.open(ResetPasswordComponent, {
      hasBackdrop: true,
      disableClose: true,
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.formValid = true;
      const email = this.loginForm.get('emailFormControl')?.value;
      const password = this.loginForm.get('passwordFormControl')?.value;
      try {
        await this.authService.login(email, password);
        this.dialog.closeAll();
        this.router.navigate(['']);
      } catch (error) {
        this.formValid = false;
        this.snackBar.open(`Une erreur s'est produite, ${error}`, 'Réessayer');
      }
    }
  }
}
