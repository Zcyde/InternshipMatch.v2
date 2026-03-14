import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.http.post('http://localhost:3000/api/login', this.loginData)
      .subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
        
            localStorage.setItem('userRole', res.role);
            
    
            if (res.role === 'admin') {
              this.router.navigate(['/admin-dashboard']);
            } else if (res.role === 'company') {
              this.router.navigate(['/company-portal']);
            } else {
              this.router.navigate(['/student-home']);
            }
          }
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Invalid Username or Password';
        }
      });
  }
}