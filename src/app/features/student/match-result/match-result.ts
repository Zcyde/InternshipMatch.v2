import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchResult as MatchResultData } from '../../../match.service';

@Component({
  selector: 'app-match-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './match-result.html',
  styleUrl: './match-result.css'
})
export class MatchResult implements OnInit {

  roleId: string = '';
  result: MatchResultData | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.roleId = this.route.snapshot.paramMap.get('roleId') || '';
    const stored = sessionStorage.getItem('matchResult');
    if (stored) {
      this.result = JSON.parse(stored);
    } else {
      this.router.navigate(['/student/role-selection']);
    }
  }

  goToRoadmap() {
    this.router.navigate(['/student/roadmap', this.roleId]);
  }

  goBack() {
    this.router.navigate(['/student/role-selection']);
  }

  exportPDF() {
    alert('Generating your readiness report PDF...');
  }
}