import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  register(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, password });
  }

  saveSession(role: string, userId: string) {
    sessionStorage.setItem('role', role);
    sessionStorage.setItem('userId', userId);
  }

  getRole(): string | null {
    return sessionStorage.getItem('role');
  }

  getUserId(): string | null {
    return sessionStorage.getItem('userId');
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('role');
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}