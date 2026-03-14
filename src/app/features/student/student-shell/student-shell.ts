import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth';

@Component({
  selector: 'app-student-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './student-shell.html',
  styleUrl: './student-shell.css'
})
export class StudentShell {
  constructor(public auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}