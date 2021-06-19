import { UtilitiesService } from '../../../services/utilities.service';
import { PasswordValidationService } from '../../../services/auth/password-validation.service';
import { User } from './../../../models/user.model';
import { UserService } from '../../../services/database/user.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  isHide = true;
  title: string;
  desc: string;
  isValidForm = false;
  isDarkTheme?: BehaviorSubject<boolean>;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private uts: UtilitiesService,
    private as: AuthService,
    private us: UserService,
    private pvs: PasswordValidationService,
    private router: Router
  ) {
    this.title = this.uts.title;
    this.desc = this.uts.desc;
    this.isDarkTheme = this.uts.observeDarkMode;
  }

  registerForm = this.formBuilder.group(
    {
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validator: this.pvs.passwordMatchValidator('password', 'confirmPassword'),
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

  openLoginDialog = () => this.dialog.open(LoginComponent, { width: '30rem' });

  openGmail = () => window.open('https://mail.google.com/', '_blank');

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      this.isValidForm = true;
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;
      try {
        const authResult = await this.as.createNewUser(email, password);
        const user: User = {
          id: authResult.user?.uid,
          nom: this.registerForm.get('firstName')?.value,
          postNom: this.registerForm.get('lastName')?.value,
          email: this.registerForm.get('email')?.value,
          dateInscription:
            firebase.default.firestore.FieldValue.serverTimestamp(),
          imgProfil: '',
        };
        await this.us.newUser(user);
        await authResult.user?.sendEmailVerification();
        this.uts.showNotification(
          `${this.title} vous a envoyé un email de vérification à l'adresse ${authResult.user?.email}`
        );
        this.openGmail();
        this.router.navigate(['emailAndSubscriptionVerification']);
      } catch (error) {
        this.isValidForm = false;
        this.uts.showNotification(`Une erreur s'est produite, ${error}`);
      }
    }
  }
}
