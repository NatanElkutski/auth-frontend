import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    const body = { email, password };
    return this.http.post(`${environment.apiUrl}/signup`, body);
  }

  login(email: string, password: string) {
    const body = { email, password };
    return this.http.post<{ token: string }>(`${environment.apiUrl}/signin`, body);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
