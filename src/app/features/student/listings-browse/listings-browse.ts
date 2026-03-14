import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Skill {
  name: string;
  weight: number;
  targetLevel: number;
}

interface Listing {
  id: number;
  title: string;
  threshold: number;
  status: 'Published' | 'Draft';
  skills: Skill[];
}

@Component({
  selector: 'app-listings-browse',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listings-browse.html',
  styleUrl: './listings-browse.css'
})
export class ListingsBrowse {

  constructor(private router: Router) {}

  listings: Listing[] = [
    {
      id: 1,
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
      id: 2,
      title: 'Backend Developer Intern',
      threshold: 65,
      status: 'Published',
      skills: [
        { name: 'Node.js', weight: 4, targetLevel: 3 },
        { name: 'SQL', weight: 3, targetLevel: 3 },
        { name: 'REST APIs', weight: 3, targetLevel: 2 },
        { name: 'Git & Version Control', weight: 2, targetLevel: 2 }
      ]
    },
    {
      id: 3,
      title: 'UI/UX Design Intern',
      threshold: 60,
      status: 'Published',
      skills: [
        { name: 'Figma / UI Design', weight: 5, targetLevel: 4 },
        { name: 'CSS / Tailwind', weight: 3, targetLevel: 3 }
      ]
    }
  ];

  expandedIndex: number | null = null;

  toggleExpand(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  assessRole(listing: Listing) {
    this.router.navigate(['/student/skill-input', listing.id]);
  }
}