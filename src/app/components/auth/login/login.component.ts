import { UtilitiesService } from './../../../services/utilities/utilities.service';
import { ResetPasswordComponent } from './../reset-password/reset-password.component';
import { AuthService } from '../../../services/auth/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isHide = true;
  formValid = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; isDarkTheme: BehaviorSubject<boolean> },
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private uts: UtilitiesService
  ) {}

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  ngOnInit(): void {}

  goToRegister(): void {
    this.dialog.closeAll();
    this.router.navigate(['/register']);
  }

  openResetPasswordDialog(): void {
    this.dialog.closeAll();
    this.dialog.open(ResetPasswordComponent, {
      width: '30rem',
      hasBackdrop: true,
      disableClose: true,
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.formValid = true;
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      try {
        await this.authService.login(email, password);
        this.dialog.closeAll();
        this.uts.refreshPage('');
      } catch (error) {
        this.formValid = false;
        this.uts.showNotification(`Une erreur s'est produite, ${error}`);
      }
    }
  }
}
