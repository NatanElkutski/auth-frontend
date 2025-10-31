import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onLogin() {
    this.errorMessage = '';
    const { email, password } = this.loginData;
    this.authService.login(email, password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        // minor: typical Angular HttpErrorResponse uses `error`, not `errors`
        this.errorMessage = err?.error?.message ?? 'Login failed. Please try again.';
      },
    });
  }
}
