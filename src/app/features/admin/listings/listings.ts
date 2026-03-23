import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListingService } from '../../../listing.service';

interface AssignedSkill {
  name: string;
  weight: number;
  targetLevel: number;
}

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listings.html',
  styleUrl: './listings.css'
})
export class Listings implements OnInit {

  // Available skills pool from service
  availableSkills: string[] = [];

  // Form fields
  newTitle = '';
  newDescription = '';
  newThreshold = 70;
  newIsPublished = true;

  // Skill assignment fields
  selectedSkill = '';
  selectedWeight = 3;
  selectedTarget = 3;

  // Skills assigned to the current listing being created
  assignedSkills: AssignedSkill[] = [];

  // All listings from DB
  listings: any[] = [];

  // Skills per listing (keyed by listingId)
  listingSkills: { [key: string]: any[] } = {};

  // Expanded listing index
  expandedId: string | null = null;

  // Toast
  toastMessage = '';
  toastVisible = false;
  toastError = false;

  // Loading states
  isSaving = false;
  isLoading = true;

  constructor(private listingService: ListingService, private cdr: ChangeDetectorRef) {}

  getPublishedCount(): number {
    return this.listings.filter(l => l.isPublished).length;
  }

  ngOnInit() {
    this.availableSkills = this.listingService.getAvailableSkills();
    this.loadListings();
  }

  loadListings() {
    this.listingService.getAllListings().subscribe({
      next: (res: any) => {
        this.listings = res.listings;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToast('Failed to load listings.', true);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  addSkillToListing() {
    if (!this.selectedSkill) {
      this.showToast('Please select a skill.', true);
      return;
    }
    if (this.assignedSkills.find(s => s.name === this.selectedSkill)) {
      this.showToast('This skill is already assigned.', true);
      return;
    }
    this.assignedSkills.push({
      name: this.selectedSkill,
      weight: this.selectedWeight,
      targetLevel: this.selectedTarget
    });
    this.selectedSkill = '';
    this.selectedWeight = 3;
    this.selectedTarget = 3;
  }

  removeAssignedSkill(index: number) {
    this.assignedSkills.splice(index, 1);
  }

  saveListing() {
    if (!this.newTitle.trim()) {
      this.showToast('Please enter a role title.', true);
      return;
    }
    if (this.assignedSkills.length === 0) {
      this.showToast('Please assign at least one skill.', true);
      return;
    }

    this.isSaving = true;

    // Step 1 — Create the listing WITH isPublished included
    this.listingService.createListing({
      title: this.newTitle.trim(),
      description: this.newDescription.trim(),
      threshold: this.newThreshold,
      isPublished: this.newIsPublished
    }).subscribe({
      next: (res: any) => {
        const listingId = res.listing._id;

        // Step 2 — Save each assigned skill
        const skillSaves = this.assignedSkills.map(skill =>
          this.listingService.addSkill({
            name: skill.name,
            listing: listingId,
            weight: skill.weight,
            targetLevel: skill.targetLevel
          })
        );

        forkJoin(skillSaves).subscribe({
          next: () => {
            this.showToast(`"${this.newTitle}" saved successfully.`);
            this.resetForm();
            this.loadListings();
            this.isSaving = false;
          },
          error: () => {
            this.showToast('Listing saved but some skills failed.', true);
            this.loadListings();
            this.isSaving = false;
          }
        });
      },
      error: () => {
        this.showToast('Failed to save listing.', true);
        this.isSaving = false;
      }
    });
  }

  toggleExpand(listingId: string) {
    if (this.expandedId === listingId) {
      this.expandedId = null;
      return;
    }

    this.expandedId = listingId;

    // Load skills for this listing if not already loaded
    if (!this.listingSkills[listingId]) {
      this.listingService.getSkillsByListing(listingId).subscribe({
        next: (res: any) => {
          this.listingSkills[listingId] = res.skills;
          this.cdr.detectChanges();
        },
        error: () => {
          this.listingSkills[listingId] = [];
          this.cdr.detectChanges();
        }
      });
    }
  }

  togglePublish(listing: any) {
    this.listingService.updateListing(listing._id, {
      isPublished: !listing.isPublished
    }).subscribe({
      next: () => {
        listing.isPublished = !listing.isPublished;
        this.showToast(`Listing ${listing.isPublished ? 'published' : 'unpublished'}.`);
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToast('Failed to update listing status.', true);
      }
    });
  }

  removeListing(listingId: string) {
    this.listingService.deleteListing(listingId).subscribe({
      next: () => {
        this.listings = this.listings.filter(l => l._id !== listingId);
        this.showToast('Listing removed.');
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToast('Failed to remove listing.', true);
      }
    });
  }

  resetForm() {
    this.newTitle = '';
    this.newDescription = '';
    this.newThreshold = 70;
    this.newIsPublished = true;
    this.assignedSkills = [];
    this.selectedSkill = '';
    this.selectedWeight = 3;
    this.selectedTarget = 3;
  }

  showToast(message: string, isError = false) {
    this.toastMessage = message;
    this.toastError = isError;
    this.toastVisible = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.toastVisible = false;
      this.cdr.detectChanges();
    }, 3000);
  }
}