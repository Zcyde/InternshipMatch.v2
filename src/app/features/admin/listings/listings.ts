import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Skill {
  name: string;
  weight: number;
  targetLevel: number;
}

interface Listing {
  title: string;
  threshold: number;
  status: 'Published' | 'Draft';
  skills: Skill[];
}

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listings.html',
  styleUrl: './listings.css'
})
export class Listings {

  // Available skills from the global skill pool
  availableSkills: string[] = [
    'Angular', 'TypeScript', 'REST APIs', 'Git & Version Control',
    'Node.js', 'CSS / Tailwind', 'SQL', 'Figma / UI Design',
    'React', 'Python', 'Java', 'MongoDB'
  ];

  // Form fields for new listing
  newTitle = '';
  newThreshold = 70;
  newStatus: 'Published' | 'Draft' = 'Published';

  // Skill assignment fields
  selectedSkill = '';
  selectedWeight = 3;
  selectedTarget = 3;

  // Skills assigned to the current listing being created
  assignedSkills: Skill[] = [];

  // Toast message
  toastMessage = '';
  toastVisible = false;
  toastError = false;

  // All saved listings
  listings: Listing[] = [
    {
      title: 'Frontend Developer Intern',
      threshold: 70,
      status: 'Published',
      skills: [
        { name: 'Angular', weight: 5, targetLevel: 4 },
        { name: 'TypeScript', weight: 3, targetLevel: 3 },
        { name: 'REST APIs', weight: 2, targetLevel: 3 }
      ]
    },
    {
      title: 'Backend Developer Intern',
      threshold: 65,
      status: 'Published',
      skills: [
        { name: 'Node.js', weight: 4, targetLevel: 3 },
        { name: 'SQL', weight: 3, targetLevel: 3 },
        { name: 'REST APIs', weight: 3, targetLevel: 2 }
      ]
    }
  ];

  // Expanded listing for viewing assigned skills
  expandedIndex: number | null = null;

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

    this.listings.push({
      title: this.newTitle.trim(),
      threshold: this.newThreshold,
      status: this.newStatus,
      skills: [...this.assignedSkills]
    });

    this.showToast(`"${this.newTitle}" saved successfully.`);
    this.resetForm();
  }

  removeListing(index: number) {
    this.listings.splice(index, 1);
  }

  toggleExpand(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  resetForm() {
    this.newTitle = '';
    this.newThreshold = 70;
    this.newStatus = 'Published';
    this.assignedSkills = [];
    this.selectedSkill = '';
  }

  showToast(message: string, isError = false) {
    this.toastMessage = message;
    this.toastError = isError;
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 3000);
  }
}