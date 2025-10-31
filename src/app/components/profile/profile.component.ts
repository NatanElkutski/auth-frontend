import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  userData: any = null;
  fetching = false;
  errorMessage = '';

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetching = true;
    this.authService.userObservable$.subscribe({
      next: (user: any) => {
        this.userData = user;
        this.fetching = false;
      },
      error: (err) => {
        console.error('Failed to fetch profile', err);
        this.errorMessage = 'Could not load profile data.';
        this.fetching = false;
      },
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
