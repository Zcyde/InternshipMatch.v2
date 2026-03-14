import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signals to track user roles across the app
  isAdmin = signal<boolean>(false);
  isUser = signal<boolean>(false);

  constructor() {}

  // Function to reset the state when logging out
  logout() {
    this.isAdmin.set(false);
    this.isUser.set(false);
    localStorage.clear();
    // Refresh to return to login state if needed
    window.location.reload();
  }
}