import { AppComponent } from './app.component';
import { FirebaseUserResolverService } from './services/auth/firebase-user-resolver.service';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { LandingPageComponent } from './components/auth/landing-page/landing-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { DetailPubpikComponent } from './components/detail-pubpik/detail-pubpik.component';
import { ChatComponent } from './components/menu-components/chat/chat.component';
import { ExplorerComponent } from './components/menu-components/explorer/explorer.component';
import { HomePageComponent } from './components/menu-components/home-page/home-page.component';
import { NotificationsComponent } from './components/menu-components/notifications/notifications.component';
import { ProfileComponent } from './components/menu-components/profile/profile.component';
import { ProcessRegisterComponent } from './components/auth/process-register/process-register.component';

const redirectLandingPage = () => redirectUnauthorizedTo(['landingPage']);

const routes: Routes = [
  {
    path: 'accueil',
    component: HomePageComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLandingPage },
    resolve: { user: FirebaseUserResolverService },
  },
  {
    path: 'landingPage',
    canActivate: [AuthGuardService],
    component: LandingPageComponent,
  },
  {
    path: 'register',
    canActivate: [AuthGuardService],
    component: RegisterComponent,
    resolve: { user: FirebaseUserResolverService },
  },
  {
    path: 'emailAndSubscriptionVerification',
    component: ProcessRegisterComponent,
    resolve: { user: FirebaseUserResolverService },
  },
  {
    path: 'explorer',
    component: ExplorerComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLandingPage },
    resolve: { user: FirebaseUserResolverService },
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AngularFireAuthGuard],

    data: { authGuardPipe: redirectLandingPage },
  },
  {
    path: 'notification',
    component: NotificationsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLandingPage },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AngularFireAuthGuard],
    resolve: { user: FirebaseUserResolverService },
    data: { authGuardPipe: redirectLandingPage },
  },
  {
    path: 'pubpik/:pubpikId',
    component: DetailPubpikComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLandingPage },
    resolve: { user: FirebaseUserResolverService },
  },
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
