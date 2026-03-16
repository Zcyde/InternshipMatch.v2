import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchResult } from '../../../match.service';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roadmap.html',
  styleUrl: './roadmap.css'
})
export class Roadmap implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) {}

  roleId: string = '';
  result: MatchResult | null = null;

  ngOnInit() {
    this.roleId = this.route.snapshot.paramMap.get('roleId') || '';

    const stored = sessionStorage.getItem('matchResult');
    if (stored) {
      this.result = JSON.parse(stored);
    } else {
      this.router.navigate(['/student/role-selection']);
    }
  }

  goBack() {
    this.router.navigate(['/student/result', this.roleId]);
  }

  goToRoleSelection() {
    this.router.navigate(['/student/role-selection']);
  }
}