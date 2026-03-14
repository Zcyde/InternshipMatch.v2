import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Skill {
  name: string;
  weight: number;
  targetLevel: number;
  importance: 'High' | 'Medium' | 'Low';
  resources: { title: string; url: string; type: string }[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css'
})
export class Skills {

  skills: Skill[] = [
    {
      name: 'Angular',
      weight: 5,
      targetLevel: 4,
      importance: 'High',
      resources: [
        { title: 'Angular Official Docs', url: 'https://angular.io/docs', type: 'Docs' },
        { title: 'Angular Crash Course', url: 'https://youtube.com', type: 'Video' }
      ]
    },
    {
      name: 'TypeScript',
      weight: 3,
      targetLevel: 3,
      importance: 'Medium',
      resources: [
        { title: 'TypeScript Handbook', url: 'https://typescriptlang.org', type: 'Docs' }
      ]
    },
    {
      name: 'REST APIs',
      weight: 2,
      targetLevel: 3,
      importance: 'Medium',
      resources: []
    }
  ];

  newName = '';
  newWeight = 3;
  newTarget = 3;
  newImportance: 'High' | 'Medium' | 'Low' = 'Medium';

  newResourceTitle = '';
  newResourceUrl = '';
  newResourceType = 'Docs';
  pendingResources: { title: string; url: string; type: string }[] = [];

  expandedIndex: number | null = null;

  toastMessage = '';
  toastVisible = false;
  toastError = false;

  resourceTypes = ['Docs', 'Video', 'Course', 'Article', 'Tutorial'];

  addResource() {
    if (!this.newResourceTitle.trim() || !this.newResourceUrl.trim()) {
      this.showToast('Please fill in resource title and URL.', true);
      return;
    }
    this.pendingResources.push({
      title: this.newResourceTitle.trim(),
      url: this.newResourceUrl.trim(),
      type: this.newResourceType
    });
    this.newResourceTitle = '';
    this.newResourceUrl = '';
    this.newResourceType = 'Docs';
  }

  removePendingResource(index: number) {
    this.pendingResources.splice(index, 1);
  }

  saveSkill() {
    if (!this.newName.trim()) {
      this.showToast('Please enter a skill name.', true);
      return;
    }
    if (this.skills.find(s => s.name.toLowerCase() === this.newName.toLowerCase())) {
      this.showToast('This skill already exists.', true);
      return;
    }

    this.skills.push({
      name: this.newName.trim(),
      weight: this.newWeight,
      targetLevel: this.newTarget,
      importance: this.newImportance,
      resources: [...this.pendingResources]
    });

    this.showToast(`"${this.newName}" added successfully.`);
    this.resetForm();
  }

  removeSkill(index: number) {
    this.skills.splice(index, 1);
  }

  toggleExpand(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  resetForm() {
    this.newName = '';
    this.newWeight = 3;
    this.newTarget = 3;
    this.newImportance = 'Medium';
    this.pendingResources = [];
    this.newResourceTitle = '';
    this.newResourceUrl = '';
  }

  showToast(message: string, isError = false) {
    this.toastMessage = message;
    this.toastError = isError;
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 3000);
  }

  getImportanceClass(importance: string) {
    if (importance === 'High') return 'badge-high';
    if (importance === 'Medium') return 'badge-medium';
    return 'badge-low';
  }
}