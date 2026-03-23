import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../../../listing.service';
import { MatchService, StudentSkill } from '../../../match.service';
import { AuthService } from '../../../auth.service';

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
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listingService: ListingService,
    private matchService: MatchService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.listingId = this.route.snapshot.paramMap.get('roleId') || '';

    // Load listing title
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

    // Load skills for this listing
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
      this.errorMessage = 'Session expired. Please log in again.';
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
          this.errorMessage = 'Failed to compute match. Please try again.';
          this.isComputing = false;
          this.cdr.detectChanges();
        }
      });
  }

  goBack() {
    this.router.navigate(['/student/role-selection']);
  }
}