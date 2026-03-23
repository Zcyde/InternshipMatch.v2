import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListingService } from '../../../listing.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css'
})
export class Skills implements OnInit {

  // All listings for the dropdown
  listings: any[] = [];

  // Available skills pool from service
  availableSkills: string[] = [];

  // Selected listing
  selectedListingId = '';

  // Skills for selected listing
  skills: any[] = [];

  // Form fields
  newName = '';
  newWeight = 3;
  newTarget = 3;

  // Edit mode
  editingSkillId: string | null = null;
  editName = '';
  editWeight = 3;
  editTarget = 3;

  // States
  isLoadingListings = true;
  isLoadingSkills = false;
  isSaving = false;

  // Toast
  toastMessage = '';
  toastVisible = false;
  toastError = false;

  constructor(private listingService: ListingService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.availableSkills = this.listingService.getAvailableSkills();
    this.listingService.getAllListings().subscribe({
      next: (res: any) => {
        this.listings = res.listings;
        this.isLoadingListings = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToast('Failed to load listings.', true);
        this.isLoadingListings = false;
        this.cdr.detectChanges();
      }
    });
  }

  onListingSelect() {
    if (!this.selectedListingId) return;
    this.isLoadingSkills = true;
    this.skills = [];

    this.listingService.getSkillsByListing(this.selectedListingId).subscribe({
      next: (res: any) => {
        this.skills = res.skills;
        this.isLoadingSkills = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToast('Failed to load skills.', true);
        this.isLoadingSkills = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveSkill() {
    if (!this.selectedListingId) {
      this.showToast('Please select a listing first.', true);
      return;
    }
    if (!this.newName.trim()) {
      this.showToast('Please enter a skill name.', true);
      return;
    }
    if (this.skills.find(s => s.name.toLowerCase() === this.newName.toLowerCase())) {
      this.showToast('This skill already exists in this listing.', true);
      return;
    }

    this.isSaving = true;

    this.listingService.addSkill({
      name: this.newName.trim(),
      listing: this.selectedListingId,
      weight: this.newWeight,
      targetLevel: this.newTarget
    }).subscribe({
      next: (res: any) => {
        this.skills.push(res.skill);
        this.showToast(`"${this.newName}" added successfully.`);
        this.resetForm();
        this.isSaving = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToast('Failed to add skill.', true);
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  startEdit(skill: any) {
    this.editingSkillId = skill._id;
    this.editName = skill.name;
    this.editWeight = skill.weight;
    this.editTarget = skill.targetLevel;
  }

  saveEdit(skillId: string) {
    this.listingService.updateSkill(skillId, {
      name: this.editName,
      weight: this.editWeight,
      targetLevel: this.editTarget
    }).subscribe({
      next: (res: any) => {
        const index = this.skills.findIndex(s => s._id === skillId);
        if (index !== -1) this.skills[index] = res.skill;
        this.editingSkillId = null;
        this.showToast('Skill updated.');
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToast('Failed to update skill.', true);
        this.cdr.detectChanges();
      }
    });
  }

  cancelEdit() {
    this.editingSkillId = null;
  }

  removeSkill(skillId: string) {
    this.listingService.deleteSkill(skillId).subscribe({
      next: () => {
        this.skills = this.skills.filter(s => s._id !== skillId);
        this.showToast('Skill removed.');
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToast('Failed to remove skill.', true);
        this.cdr.detectChanges();
      }
    });
  }

  proficiencyLabel(level: number): string {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Elementary';
      case 3: return 'Intermediate';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return 'N/A';
    }
  }

  resetForm() {
    this.newName = '';
    this.newWeight = 3;
    this.newTarget = 3;
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