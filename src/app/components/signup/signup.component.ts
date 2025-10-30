import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupData = { email: '', password: '' };
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSignup() {
    this.successMessage = '';
    this.errorMessage = '';

    const { email, password } = this.signupData;
    this.authService.signup(email, password).subscribe({
      next: () => {
        this.successMessage = 'Registration successfull please login.';
        this.signupData = { email: '', password: '' };
        this.authService.login(email, password).subscribe({
          next: (response) => {
            const token = response.token;
            localStorage.setItem('token', token);
            this.router.navigate(['/profile']);
          },
          error: (err) => {
            this.router.navigate(['/login']);
          },
        });
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Signup failed. Please try again.';
      },
    });
  }
}
