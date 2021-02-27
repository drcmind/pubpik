import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';

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
import { AddPubPikComponent } from './components/home/add-pub-pik/add-pub-pik.component';
import { UsersComponent } from './components/home/users/users.component';
import { ChatComponent } from './components/home/chat/chat.component';
import { NotificationsComponent } from './components/home/notifications/notifications.component';
import { ProfileComponent } from './components/home/profile/profile.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';

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
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
