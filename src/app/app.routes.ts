import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductComponent } from './components/product/product.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [loginGuard] },
  { path: 'home', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'products', component: ProductListComponent, canActivate: [authGuard] },
  { path: 'products/:id', component: ProductComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
