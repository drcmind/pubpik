import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AppRoutingModule } from './app-routing.module';
import { MaterialUiModule } from './material-ui/material-ui.module';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { environment } from 'src/environments/environment';
registerLocaleData(localeFr, 'fr');

import { AppComponent } from './app.component';
import { LandingPageComponent } from './components/auth/landing-page/landing-page.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { ExplorerComponent } from './components/menu-components/explorer/explorer.component';
import { AddPubPikComponent } from './components/menu-components/home-page/add-pub-pik/add-pub-pik.component';
import { DeleteDialogComponent } from './components/detail-pubpik/delete-dialog.component';
import { DetailPubpikComponent } from './components/detail-pubpik/detail-pubpik.component';
import { HomePageComponent } from './components/menu-components/home-page/home-page.component';
import { EditProfileComponent } from './components/menu-components/profile/edit-profile/edit-profile.component';
import { ProfileComponent } from './components/menu-components/profile/profile.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PubpikFeedComponent } from './components/shared-ui/pubpik-feed/pubpik-feed.component';
import { UserProfilImgComponent } from './components/shared-ui/user-profil-img/user-profil-img.component';
import { EditInterestsCenterComponent } from './components/menu-components/home-page/edit-interests-center/edit-interests-center.component';
import { MenuComponentsComponent } from './components/menu-components/menu-component';
import { RegisterComponent } from './components/auth/register/register.component';
import { EmailAndSubscriptionVerificationComponent } from './components/auth/email-and-subscription-verification/email-and-subscription-verification.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginComponent,
    RegisterComponent,
    EmailAndSubscriptionVerificationComponent,
    NotFoundComponent,
    HomePageComponent,
    ExplorerComponent,
    AddPubPikComponent,
    ProfileComponent,
    ResetPasswordComponent,
    DetailPubpikComponent,
    PubpikFeedComponent,
    DeleteDialogComponent,
    UserProfilImgComponent,
    EditProfileComponent,
    EditInterestsCenterComponent,
    MenuComponentsComponent,
  ],
  entryComponents: [
    LoginComponent,
    ResetPasswordComponent,
    AddPubPikComponent,
    DeleteDialogComponent,
    EditProfileComponent,
    EditInterestsCenterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialUiModule,
    FormsModule,
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'fr',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
