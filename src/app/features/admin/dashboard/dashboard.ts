import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  stats = [
    { label: 'Published Listings', value: 0 },
    { label: 'Total Skills', value: 0 },
    { label: 'Assessments Today', value: 0 }
  ];
}