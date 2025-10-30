import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';
import { CharactersComponent } from './components/characters/characters.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [loginGuard] },
  { path: 'home', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'products', component: CharactersComponent, canActivate: [authGuard] },
  { path: 'products/:id', component: CharactersComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
