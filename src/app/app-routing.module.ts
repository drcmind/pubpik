import { DetailPubpikComponent } from './components/home/home-page/detail-pubpik/detail-pubpik.component';
import { FirebaseUserResolverService } from './services/auth/firebase-user-resolver.service';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { HomeComponent } from './components/home/home.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLandingPage = () =>
  redirectUnauthorizedTo(['landingPage']);

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLandingPage },
    resolve: { user: FirebaseUserResolverService },
  },
  {
    path: 'pubpik/:pubpikId',
    component: DetailPubpikComponent,
    canActivate: [AngularFireAuthGuard],
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
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
