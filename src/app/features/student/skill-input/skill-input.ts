import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

@Component({
  selector: 'app-skill-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skill-input.html',
  styleUrl: './skill-input.css'
})
export class SkillInput implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) {}

  roleId: number = 0;
  listing: Listing | null = null;
  studentSkills: StudentSkill[] = [];
  activeTab: 'manual' | 'resume' = 'manual';
  resumeFileName = '';
  resumeParsed = false;
  resumeParsing = false;

  // Same listings data — in a real app this comes from a service
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

    // Pre-populate student skills with 0 proficiency for each required skill
    if (this.listing) {
      this.studentSkills = this.listing.skills.map(s => ({
        skillId: s.name,
        name: s.name,
        proficiencyLevel: 0
      }));
    }
  }

  proficiencyLabel(level: number): string {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Elementary';
      case 3: return 'Intermediate';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return 'Not set';
    }
  }

  onResumeUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.resumeFileName = file.name;
    this.resumeParsing = true;
    this.resumeParsed = false;

    // Simulate resume parsing delay
    setTimeout(() => {
      this.resumeParsing = false;
      this.resumeParsed = true;
      // Simulate parsed skills — in real app this calls backend
      this.studentSkills = this.studentSkills.map(s => ({
        ...s,
        proficiencyLevel: Math.floor(Math.random() * 3) + 1
      }));
    }, 2000);
  }

  calculateAndNavigate() {
    // Store skills in sessionStorage to pass to result page
    sessionStorage.setItem('studentSkills', JSON.stringify(this.studentSkills));
    sessionStorage.setItem('listingId', String(this.roleId));
    this.router.navigate(['/student/result', this.roleId]);
  }

  goBack() {
    this.router.navigate(['/student/listings']);
  }
}