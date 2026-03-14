import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

interface Skill {
  name: string;
  weight: number;
  targetLevel: number;
  resources: { title: string; url: string; type: string }[];
}

interface Listing {
  id: number;
  title: string;
  threshold: number;
  skills: Skill[];
}

interface StudentSkill {
  skillId: string;
  name: string;
  proficiencyLevel: number;
}

interface SkillGap {
  name: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  isMissing: boolean;
  resources: { title: string; url: string; type: string }[];
}

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roadmap.html',
  styleUrl: './roadmap.css'
})
export class Roadmap implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) {}

  roleId: number = 0;
  listing: Listing | null = null;
  studentSkills: StudentSkill[] = [];
  skillGaps: SkillGap[] = [];
  score: number = 0;

  listings: Listing[] = [
    {
      id: 1,
      title: 'Frontend Developer Intern',
      threshold: 70,
      skills: [
        {
          name: 'Angular',
          weight: 5,
          targetLevel: 4,
          resources: [
            { title: 'Angular Official Docs', url: 'https://angular.io/docs', type: 'Docs' },
            { title: 'Angular Crash Course', url: 'https://youtube.com', type: 'Video' },
            { title: 'Tour of Heroes Tutorial', url: 'https://angular.io/tutorial', type: 'Tutorial' }
          ]
        },
        {
          name: 'TypeScript',
          weight: 3,
          targetLevel: 3,
          resources: [
            { title: 'TypeScript Handbook', url: 'https://typescriptlang.org/docs', type: 'Docs' },
            { title: 'TypeScript Crash Course', url: 'https://youtube.com', type: 'Video' }
          ]
        },
        {
          name: 'REST APIs',
          weight: 2,
          targetLevel: 3,
          resources: [
            { title: 'What is a REST API?', url: 'https://redhat.com', type: 'Article' },
            { title: 'APIs and Web Services', url: 'https://coursera.org', type: 'Course' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Backend Developer Intern',
      threshold: 65,
      skills: [
        {
          name: 'Node.js',
          weight: 4,
          targetLevel: 3,
          resources: [
            { title: 'Node.js Official Docs', url: 'https://nodejs.org/docs', type: 'Docs' },
            { title: 'Node.js Crash Course', url: 'https://youtube.com', type: 'Video' }
          ]
        },
        {
          name: 'SQL',
          weight: 3,
          targetLevel: 3,
          resources: [
            { title: 'SQL Tutorial — W3Schools', url: 'https://w3schools.com/sql', type: 'Tutorial' }
          ]
        },
        {
          name: 'REST APIs',
          weight: 3,
          targetLevel: 2,
          resources: [
            { title: 'REST API Basics', url: 'https://restfulapi.net', type: 'Article' }
          ]
        },
        {
          name: 'Git & Version Control',
          weight: 2,
          targetLevel: 2,
          resources: [
            { title: 'Git Documentation', url: 'https://git-scm.com/doc', type: 'Docs' },
            { title: 'Git & GitHub Crash Course', url: 'https://youtube.com', type: 'Video' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'UI/UX Design Intern',
      threshold: 60,
      skills: [
        {
          name: 'Figma / UI Design',
          weight: 5,
          targetLevel: 4,
          resources: [
            { title: 'Figma Official Tutorials', url: 'https://figma.com/resources', type: 'Tutorial' },
            { title: 'UI Design for Beginners', url: 'https://youtube.com', type: 'Video' }
          ]
        },
        {
          name: 'CSS / Tailwind',
          weight: 3,
          targetLevel: 3,
          resources: [
            { title: 'Tailwind CSS Docs', url: 'https://tailwindcss.com/docs', type: 'Docs' },
            { title: 'CSS Full Course', url: 'https://youtube.com', type: 'Video' }
          ]
        }
      ]
    }
  ];

  ngOnInit() {
    this.roleId = Number(this.route.snapshot.paramMap.get('roleId'));
    this.listing = this.listings.find(l => l.id === this.roleId) || null;

    const stored = sessionStorage.getItem('studentSkills');
    if (stored) {
      this.studentSkills = JSON.parse(stored);
    }

    if (this.listing) {
      this.buildRoadmap();
    }
  }

  buildRoadmap() {
    if (!this.listing) return;

    let totalEarned = 0;
    let totalMax = 0;

    for (const required of this.listing.skills) {
      const maxPoints = required.targetLevel * required.weight;
      totalMax += maxPoints;

      const studentSkill = this.studentSkills.find(
        s => s.name.toLowerCase() === required.name.toLowerCase()
      );
      const currentLevel = studentSkill?.proficiencyLevel ?? 0;
      const earned = Math.min(currentLevel, required.targetLevel) * required.weight;
      totalEarned += earned;

      const meetsTarget = currentLevel >= required.targetLevel;

      if (!meetsTarget) {
        this.skillGaps.push({
          name: required.name,
          currentLevel,
          targetLevel: required.targetLevel,
          gap: required.targetLevel - currentLevel,
          isMissing: currentLevel === 0,
          resources: required.resources
        });
      }
    }

    this.score = totalMax > 0
      ? Math.round((totalEarned / totalMax) * 100)
      : 0;

    this.skillGaps.sort((a, b) => b.gap - a.gap);
  }

  getProgressPercent(current: number, target: number): number {
    if (target === 0) return 0;
    return Math.round((current / target) * 100);
  }

  goBack() {
    this.router.navigate(['/student/result', this.roleId]);
  }

  goToListings() {
    this.router.navigate(['/student/listings']);
  }
}