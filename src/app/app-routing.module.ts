import { MenuComponentsComponent } from './components/menu-components/menu-component';
import { DetailPubpikComponent } from './components/detail-pubpik/detail-pubpik.component';
import { ProfileComponent } from './components/menu-components/profile/profile.component';
import { ExplorerComponent } from './components/menu-components/explorer/explorer.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LandingPageComponent } from './components/auth/landing-page/landing-page.component';
import { FirebaseUserResolverService } from './services/auth/firebase-user-resolver.service';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { HomePageComponent } from './components/menu-components/home-page/home-page.component';
import { EmailAndSubscriptionVerificationComponent } from './components/auth/email-and-subscription-verification/email-and-subscription-verification.component';

const redirectLandingPage = () => redirectUnauthorizedTo(['landingPage']);

const routes: Routes = [
  {
    path: 'pubpik',
    component: MenuComponentsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLandingPage },
    resolve: { user: FirebaseUserResolverService },
    children: [
      {
        path: 'accueil',
        component: HomePageComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectLandingPage },
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
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AngularFireAuthGuard],
        resolve: { user: FirebaseUserResolverService },
        data: { authGuardPipe: redirectLandingPage },
      },
    ],
  },
  {
    path: 'landingPage',
    component: LandingPageComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'emailAndSubscriptionVerification',
    component: EmailAndSubscriptionVerificationComponent,
    resolve: { user: FirebaseUserResolverService },
  },
  {
    path: 'pubpik-detail/:pubpikId',
    component: DetailPubpikComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLandingPage },
    resolve: { user: FirebaseUserResolverService },
  },
  { path: '', redirectTo: 'pubpik/accueil', pathMatch: 'full' },
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
