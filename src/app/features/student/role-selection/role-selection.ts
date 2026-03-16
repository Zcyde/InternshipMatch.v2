import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ListingService } from '../../../listing.service';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-selection.html',
  styleUrl: './role-selection.css'
})
export class RoleSelection implements OnInit {

  listings: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private listingService: ListingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.listingService.getPublishedListings().subscribe({
      next: (res: any) => {
        this.listings = res.listings;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load roles. Please try again.';
        this.isLoading = false;
      }
    });
  }

  selectRole(listingId: string) {
    this.router.navigate(['/student/skill-input', listingId]);
  }
}