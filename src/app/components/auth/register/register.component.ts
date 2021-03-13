import { PasswordValidationService } from '../../../services/auth/password-validation.service';
import { User } from './../../../models/user.model';
import { UserService } from '../../../services/database/user.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { title, desc } from 'src/global_variables';
import { LoginComponent } from '../login/login.component';
import * as firebase from 'firebase/app';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  isHide = true;
  title = title;
  desc = desc;
  isValidForm = false;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private passwordValidation: PasswordValidationService
  ) {}

  // tslint:disable-next-line: deprecation
  registerForm = this.formBuilder.group(
    {
      firstNameFormControl: ['', Validators.required],
      lastNameFormControl: [''],
      emailFormControl: ['', [Validators.required, Validators.email]],
      passwordFormControl: [
        '',
        [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)],
      ],
      confirmPasswordFormControl: ['', Validators.required],
    },
    {
      validator: this.passwordValidation.passwordMatchValidator(
        'passwordFormControl',
        'confirmPasswordFormControl'
      ),
    }
  );

  get firstNameFormControl(): AbstractControl | null {
    return this.registerForm.get('firstNameFormControl');
  }

  get lastNameFormControl(): AbstractControl | null {
    return this.registerForm.get('lastNameFormControl');
  }

  get emailFormControl(): AbstractControl | null {
    return this.registerForm.get('emailFormControl');
  }

  get passwordFormControl(): AbstractControl | null {
    return this.registerForm.get('passwordFormControl');
  }

  get confirmPasswordFormControl(): AbstractControl | null {
    return this.registerForm.get('confirmPasswordFormControl');
  }

  ngOnInit(): void {}

  openLoginDialog(): void {
    this.dialog.open(LoginComponent, {
      hasBackdrop: true,
      disableClose: true,
    });
  }

  goToLandingPage = () => this.router.navigate(['/landingPage']);

  openGmail = () => window.open('https://mail.google.com/', '_blank');

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      this.isValidForm = true;
      const email = this.registerForm.get('emailFormControl')?.value;
      const password = this.registerForm.get('passwordFormControl')?.value;
      try {
        const authResult = await this.authService.createNewUser(
          email,
          password
        );
        const user: User = {
          id: authResult.user?.uid,
          nom: this.registerForm.get('firstNameFormControl')?.value,
          postNom: this.registerForm.get('lastNameFormControl')?.value,
          email: this.registerForm.get('emailFormControl')?.value,
          dateInscription: firebase.default.firestore.FieldValue.serverTimestamp(),
          imgProfil: '',
        };
        await authResult.user?.sendEmailVerification();
        await this.userService.newUser(user);
        this.snackBar.open(
          `${title} vous a envoyé un email de vérification à l'adresse ${authResult.user?.email}`,
          'OK'
        );
        this.router.navigate(['']);
        this.openGmail();
      } catch (error) {
        this.isValidForm = false;
        this.snackBar.open(`Une erreur s'est produite, ${error}`, 'Réessayer');
      }
    }
  }
}
