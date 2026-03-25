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
  loginData = { username: '', password: '', name: '', email: '' };
  errorMessage: string = '';
  successMessage: string = '';
  isSignupMode: boolean = false;
  isAdminMode: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  switchToAdmin() {
    this.isAdminMode = true;
    this.isSignupMode = false;
    this.successMessage = '';
    this.resetForm();
  }

  switchToStudent() {
    this.isAdminMode = false;
    this.isSignupMode = false;
    this.successMessage = '';
    this.resetForm();
  }

  onLogin() {
    this.successMessage = '';
    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Please enter your credentials.';
      return;
    }

    this.authService.login(this.loginData.username, this.loginData.password)
      .subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            const fullNameToSave = res.fullName || res.username || 'Student';

            // saveSession already sets fullName in sessionStorage — no need to duplicate
            this.authService.saveSession(res.role, res.userId, fullNameToSave);

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
    const { username, password, name, email } = this.loginData;
    if (!username || !password || !name || !email) {
      this.errorMessage = 'All fields are required for student registration.';
      return;
    }

    this.authService.register(this.loginData)
      .subscribe({
        next: (res: any) => {
          this.successMessage = res.message || 'Registration successful! You can now log in.';
          alert(this.successMessage);
          this.isSignupMode = false;
          this.isAdminMode = false;
          this.resetForm();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Registration failed. Try again.';
        }
      });
  }

  toggleMode() {
    this.isSignupMode = !this.isSignupMode;
    this.isAdminMode = false;
    this.successMessage = '';
    this.resetForm();
  }

  private resetForm() {
    this.errorMessage = '';
    this.loginData = { username: '', password: '', name: '', email: '' };
  }
}