import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { BehaviorSubject, catchError, distinctUntilChanged, map, Observable, of, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user$ = new BehaviorSubject<any | null>(null);
  private profileLoaded = false;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http.post(`${environment.apiUrl}/signup`, { email, password });
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/signin`, { email, password }).pipe(
      tap(({ token }) => localStorage.setItem('token', token)),
      switchMap(() => this.loadProfile())
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.user$.next(null);
    this.profileLoaded = false;
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** 🔹 Token accessor for the interceptor */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  loadProfile(): Observable<any | null> {
    const token = this.getToken();

    if (!token) {
      this.profileLoaded = true;
      this.user$.next(null);
      return of(null);
    }

    const shouldFetch = !this.profileLoaded || this.user$.value == null;
    if (!shouldFetch) return of(this.user$.value);

    return this.http.get<{ user: any }>(`${environment.apiUrl}/profile`).pipe(
      map((res) => res.user),
      tap((user) => {
        this.user$.next(user);
        this.profileLoaded = true;
      }),
      catchError(() => {
        this.user$.next(null);
        this.profileLoaded = true;
        return of(null);
      }),
      take(1)
    );
  }

  readonly userObservable$ = this.user$.asObservable();

  readonly isAuthenticated$ = this.userObservable$.pipe(
    map((user) => !!user),
    distinctUntilChanged()
  );
}
