import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginData = { username: '', password: '' };
  errorMessage: string = '';
  isSignupMode: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Please enter your username and password.';
      return;
    }

    this.authService.login(this.loginData.username, this.loginData.password)
      .subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            this.authService.saveSession(res.role, res.userId || 'admin');
            if (res.role === 'admin') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/student']);
            }
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Invalid username or password.';
        }
      });
  }

  onSignup() {
    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Please enter a username and password.';
      return;
    }

    this.authService.register(this.loginData.username, this.loginData.password)
      .subscribe({
        next: (res: any) => {
          alert(res.message || 'Registration successful! You can now log in.');
          this.isSignupMode = false;
          this.errorMessage = '';
          this.loginData = { username: '', password: '' };
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Registration failed. Try again.';
        }
      });
  }

  onAdminQuickAccess() {
    this.loginData = { username: 'admin', password: 'admin123' };
    this.onLogin();
  }

  toggleMode() {
    this.isSignupMode = !this.isSignupMode;
    this.errorMessage = '';
    this.loginData = { username: '', password: '' };
  }
}