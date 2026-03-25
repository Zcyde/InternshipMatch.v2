import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../../../listing.service';
import { MatchService, StudentSkill } from '../../../match.service';
import { AuthService } from '../../../auth.service';
// After renaming the file to resume-parser.service.ts

import { ResumeParserService } from '../../../core/services/resume-parser.service';

@Component({
  selector: 'app-skill-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skill-input.html',
  styleUrl: './skill-input.css'
})
export class SkillInput implements OnInit {
  listingId: string = '';
  listingTitle: string = '';
  skills: any[] = [];
  studentSkills: StudentSkill[] = [];
  isLoading = true;
  isComputing = false;
  isScanning = false; // New state for scanning
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listingService: ListingService,
    private matchService: MatchService,
    private authService: AuthService,
    private resumeService: ResumeParserService, // Injected service
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.listingId = this.route.snapshot.paramMap.get('roleId') || '';

    this.listingService.getListing(this.listingId).subscribe({
      next: (res: any) => {
        this.listingTitle = res.listing.title;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load listing.';
        this.cdr.detectChanges();
      }
    });

    this.listingService.getSkillsByListing(this.listingId).subscribe({
      next: (res: any) => {
        this.skills = res.skills;
        this.studentSkills = res.skills.map((s: any) => ({
          name: s.name,
          proficiencyLevel: 0
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load skills.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.isScanning = true;
    this.errorMessage = '';

    try {
      const text = await this.resumeService.extractText(file);
      const lowerText = text.toLowerCase();

      this.studentSkills.forEach(skill => {
        if (lowerText.includes(skill.name.toLowerCase())) {
          // Default to Level 3 (Intermediate) if found
          skill.proficiencyLevel = 3;
        }
      });

      this.isScanning = false;
      this.cdr.detectChanges();
    } catch (error: any) {
      console.error('Resume parsing error:', error);
      this.errorMessage = `Failed to parse the resume. Error: ${error.message || error.toString()}`;
      this.isScanning = false;
      this.cdr.detectChanges();
    }
  }

  proficiencyLabel(level: number): string {
    const labels: { [key: number]: string } = {
      1: 'Beginner', 2: 'Elementary', 3: 'Intermediate', 4: 'Advanced', 5: 'Expert'
    };
    return labels[level] || 'Not set';
  }

  getProficiencyForSkill(skillName: string): number {
    return this.studentSkills.find(s => s.name === skillName)?.proficiencyLevel || 0;
  }

  setProficiency(skillName: string, level: number) {
    const skill = this.studentSkills.find(s => s.name === skillName);
    if (skill) {
      skill.proficiencyLevel = level;
      this.cdr.detectChanges();
    }
  }

  computeMatch() {
    const studentId = this.authService.getUserId();
    if (!studentId) {
      this.router.navigate(['/login']);
      return;
    }

    this.isComputing = true;
    this.matchService.computeMatch(studentId, this.listingId, this.studentSkills)
      .subscribe({
        next: (res: any) => {
          sessionStorage.setItem('matchResult', JSON.stringify(res.result));
          this.router.navigate(['/student/result', this.listingId]);
        },
        error: () => {
          this.errorMessage = 'Failed to compute match.';
          this.isComputing = false;
          this.cdr.detectChanges();
        }
      });
  }

  goBack() {
    this.router.navigate(['/student/role-selection']);
  }
}