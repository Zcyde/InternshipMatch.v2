import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ListingService } from '../../../listing.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  stats = [
    { label: 'Total Listings', value: 0 },
    { label: 'Published Listings', value: 0 },
    { label: 'Total Skills', value: 0 }
  ];

  isLoading = true;

  constructor(private listingService: ListingService) {}

  ngOnInit() {
    // Fetch all listings
    this.listingService.getAllListings().subscribe({
      next: (res: any) => {
        const listings = res.listings;
        const published = listings.filter((l: any) => l.isPublished);
        this.stats[0].value = listings.length;
        this.stats[1].value = published.length;

        // Fetch skills count for each listing
        let totalSkills = 0;
        let completed = 0;

        if (listings.length === 0) {
          this.isLoading = false;
          return;
        }

        listings.forEach((listing: any) => {
          this.listingService.getSkillsByListing(listing._id).subscribe({
            next: (skillRes: any) => {
              totalSkills += skillRes.skills.length;
              completed++;
              if (completed === listings.length) {
                this.stats[2].value = totalSkills;
                this.isLoading = false;
              }
            },
            error: () => {
              completed++;
              if (completed === listings.length) {
                this.stats[2].value = totalSkills;
                this.isLoading = false;
              }
            }
          });
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}