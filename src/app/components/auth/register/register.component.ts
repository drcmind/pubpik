import { UtilitiesService } from './../../../services/utilities/utilities.service';
import { PasswordValidationService } from '../../../services/auth/password-validation.service';
import { User } from './../../../models/user.model';
import { UserService } from '../../../services/database/user.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs';
import { desc, title } from 'src/app/services/utilities/global_variables';

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
  isDarkTheme?: BehaviorSubject<boolean>;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private uts: UtilitiesService,
    private authService: AuthService,
    private userService: UserService,
    private passwordValidation: PasswordValidationService
  ) {
    this.isDarkTheme = this.uts.observeDarkMode;
  }

  // tslint:disable-next-line: deprecation
  registerForm = this.formBuilder.group(
    {
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validator: this.passwordValidation.passwordMatchValidator(
        'password',
        'confirmPassword'
      ),
    }
  );

  get firstName(): AbstractControl | null {
    return this.registerForm.get('firstName');
  }

  get lastName(): AbstractControl | null {
    return this.registerForm.get('lastName');
  }

  get email(): AbstractControl | null {
    return this.registerForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.registerForm.get('password');
  }

  get confirmPassword(): AbstractControl | null {
    return this.registerForm.get('confirmPassword');
  }

  ngOnInit(): void {}

  openLoginDialog(): void {
    this.dialog.open(LoginComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: { title: this.title, isDarkTheme: this.isDarkTheme },
    });
  }

  goToLandingPage = () => this.router.navigate(['/landingPage']);

  openGmail = () => window.open('https://mail.google.com/', '_blank');

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      this.isValidForm = true;
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;
      try {
        const authResult = await this.authService.createNewUser(
          email,
          password
        );
        const user: User = {
          id: authResult.user?.uid,
          nom: this.registerForm.get('firstName')?.value,
          postNom: this.registerForm.get('lastName')?.value,
          email: this.registerForm.get('email')?.value,
          dateInscription: firebase.default.firestore.FieldValue.serverTimestamp(),
          imgProfil: '',
        };
        await this.userService.newUser(user);
        await authResult.user?.sendEmailVerification();
        this.uts.showNotification(
          `${title} vous a envoyé un email de vérification à l'adresse ${authResult.user?.email}`,
          'OK'
        );
        this.router.navigate(['']);
        this.openGmail();
      } catch (error) {
        this.isValidForm = false;
        this.uts.showNotification(
          `Une erreur s'est produite, ${error}`,
          'Réessayer'
        );
      }
    }
  }
}
