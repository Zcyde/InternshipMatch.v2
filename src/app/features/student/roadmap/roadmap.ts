import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchResult } from '../../../match.service';

interface Resource {
  type: string;   // e.g. 'Video', 'Docs', 'Article', 'Course'
  label: string;
  url: string;
}

const SKILL_RESOURCES: { [key: string]: Resource[] } = {
  'git & version control': [
    { type: 'Video', label: 'Git & GitHub Crash Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
    { type: 'Docs',  label: 'Official Git Documentation', url: 'https://git-scm.com/doc' },
    { type: 'Course', label: 'Learn Git Branching (Interactive)', url: 'https://learngitbranching.js.org/' }
  ],
  'figma / ui design': [
    { type: 'Video', label: 'Figma Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8' },
    { type: 'Docs',  label: 'Figma Learn — Getting Started', url: 'https://help.figma.com/hc/en-us/categories/360002051613' },
    { type: 'Article', label: 'Intro to UI Design – Coursera', url: 'https://www.coursera.org/articles/ui-design' }
  ],
  'angular': [
    { type: 'Docs',  label: 'Angular Official Tutorial', url: 'https://angular.dev/tutorials' },
    { type: 'Video', label: 'Angular Crash Course – Traversy Media', url: 'https://www.youtube.com/watch?v=3dHNOWTI7H8' },
    { type: 'Course', label: 'Tour of Heroes Tutorial', url: 'https://angular.dev/tutorials/learn-angular' }
  ],
  'html': [
    { type: 'Docs',  label: 'MDN Web Docs — HTML Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML' },
    { type: 'Video', label: 'HTML Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=kUMe1FH4CHE' }
  ],
  'css': [
    { type: 'Docs',  label: 'MDN Web Docs — CSS Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS' },
    { type: 'Article', label: 'CSS-Tricks — A Complete Guide to Flexbox', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
    { type: 'Video', label: 'CSS Crash Course – Traversy Media', url: 'https://www.youtube.com/watch?v=yfoY53QXEnI' }
  ],
  'javascript': [
    { type: 'Docs',  label: 'MDN — JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' },
    { type: 'Article', label: 'The Modern JavaScript Tutorial', url: 'https://javascript.info/' },
    { type: 'Video', label: 'JavaScript Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg' }
  ],
  'typescript': [
    { type: 'Docs',  label: 'TypeScript Official Handbook', url: 'https://www.typescriptlang.org/docs/handbook/' },
    { type: 'Video', label: 'TypeScript Crash Course – Traversy Media', url: 'https://www.youtube.com/watch?v=BCg4U1FzODs' }
  ],
  'react': [
    { type: 'Docs',  label: 'React Official Tutorial', url: 'https://react.dev/learn' },
    { type: 'Video', label: 'React Course for Beginners – freeCodeCamp', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8' }
  ],
  'node.js': [
    { type: 'Docs',  label: 'Node.js Official Getting Started', url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs' },
    { type: 'Video', label: 'Node.js Crash Course – Traversy Media', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4' }
  ],
  'python': [
    { type: 'Docs',  label: 'Python.org Official Tutorial', url: 'https://docs.python.org/3/tutorial/' },
    { type: 'Video', label: 'Python for Beginners – freeCodeCamp', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw' }
  ],
  'java': [
    { type: 'Docs',  label: 'Oracle Java Tutorials', url: 'https://docs.oracle.com/javase/tutorial/' },
    { type: 'Video', label: 'Java Full Course – freeCodeCamp', url: 'https://www.youtube.com/watch?v=grEKMHGYyns' }
  ],
  'sql': [
    { type: 'Docs',  label: 'W3Schools SQL Tutorial', url: 'https://www.w3schools.com/sql/' },
    { type: 'Video', label: 'SQL Tutorial – freeCodeCamp', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' }
  ],
  'mongodb': [
    { type: 'Docs',  label: 'MongoDB University (Free Courses)', url: 'https://learn.mongodb.com/' },
    { type: 'Video', label: 'MongoDB Crash Course – Traversy Media', url: 'https://www.youtube.com/watch?v=-56x56UppqQ' }
  ]
};

// ... (keep existing imports and interface)

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roadmap.html',
  styleUrl: './roadmap.css'
})
export class Roadmap implements OnInit {
  roleId: string = '';
  result: MatchResult | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.roleId = this.route.snapshot.paramMap.get('roleId') || '';
    const stored = sessionStorage.getItem('matchResult');
    if (stored) {
      this.result = JSON.parse(stored);
    } else {
      this.router.navigate(['/student/role-selection']);
    }
  }

  // ✅ New Getter: Kukunin lang ang skills na mas mababa ang level kaysa sa target
  get skillsToImprove() {
    if (!this.result) return [];
    return this.result.matchedSkills.filter(
      skill => skill.studentLevel < skill.targetLevel
    );
  }

  // ✅ Updated Getter for count sa summary box
  get totalGapsCount(): number {
    if (!this.result) return 0;
    return this.result.missingSkills.length + this.skillsToImprove.length;
  }

  getResources(skillName: string): Resource[] {
    const key = skillName.toLowerCase().trim();
    return SKILL_RESOURCES[key] || [
      { type: 'Search', label: `Search tutorials for "${skillName}"`, url: `https://www.google.com/search?q=learn+${encodeURIComponent(skillName)}+tutorial` }
    ];
  }

  goBack() {
    this.router.navigate(['/student/result', this.roleId]);
  }

  goToRoleSelection() {
    this.router.navigate(['/student/role-selection']);
  }
}