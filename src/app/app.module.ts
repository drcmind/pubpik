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
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { MaterialUiModule } from './material-ui/material-ui.module';
import { HomePageComponent } from './components/home/home-page/home-page.component';
import { ExplorerComponent } from './components/home/explorer/explorer.component';
import { UsersComponent } from './components/home/users/users.component';
import { ChatComponent } from './components/home/chat/chat.component';
import { NotificationsComponent } from './components/home/notifications/notifications.component';
import { ProfileComponent } from './components/home/profile/profile.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');
import { DetailPubpikComponent } from './components/home/home-page/detail-pubpik/detail-pubpik.component';
import { AddPubPikComponent } from './components/home/home-page/add-pub-pik/add-pub-pik.component';
import { PubpikFeedComponent } from './components/pubpik-feed/pubpik-feed.component';
import { ProcessRegisterComponent } from './components/auth/register/process-register/process-register.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginComponent,
    RegisterComponent,
    NotFoundComponent,
    HomeComponent,
    HomePageComponent,
    ExplorerComponent,
    AddPubPikComponent,
    UsersComponent,
    ChatComponent,
    NotificationsComponent,
    ProfileComponent,
    ResetPasswordComponent,
    DetailPubpikComponent,
    PubpikFeedComponent,
    ProcessRegisterComponent,
  ],
  entryComponents: [LoginComponent, ResetPasswordComponent, AddPubPikComponent],
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
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
