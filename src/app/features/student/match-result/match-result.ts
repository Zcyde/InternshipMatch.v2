import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

interface Skill {
  name: string;
  weight: number;
  targetLevel: number;
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
}

@Component({
  selector: 'app-match-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-result.html',
  styleUrl: './match-result.css'
})
export class MatchResult implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) {}

  roleId: number = 0;
  listing: Listing | null = null;
  studentSkills: StudentSkill[] = [];

  score: number = 0;
  passed: boolean = false;
  matchedSkills: string[] = [];
  missingSkills: string[] = [];
  skillGaps: SkillGap[] = [];

  listings: Listing[] = [
    {
      id: 1,
      title: 'Frontend Developer Intern',
      threshold: 70,
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
      skills: [
        { name: 'Figma / UI Design', weight: 5, targetLevel: 4 },
        { name: 'CSS / Tailwind', weight: 3, targetLevel: 3 }
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
      this.calculateMatch();
    }
  }

  calculateMatch() {
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

      if (meetsTarget) {
        this.matchedSkills.push(required.name);
      } else {
        if (currentLevel === 0) {
          this.missingSkills.push(required.name);
        }
        this.skillGaps.push({
          name: required.name,
          currentLevel,
          targetLevel: required.targetLevel,
          gap: required.targetLevel - currentLevel,
          isMissing: currentLevel === 0
        });
      }
    }

    this.score = totalMax > 0
      ? Math.round((totalEarned / totalMax) * 100)
      : 0;

    this.passed = this.score >= (this.listing?.threshold ?? 70);
    this.skillGaps.sort((a, b) => b.gap - a.gap);
  }

  goToRoadmap() {
    this.router.navigate(['/student/roadmap', this.roleId]);
  }

  goBack() {
    this.router.navigate(['/student/listings']);
  }

  exportPDF() {
    alert('Generating your readiness report PDF...');
  }
}