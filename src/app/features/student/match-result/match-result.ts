import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchResult as MatchResultData } from '../../../match.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  isExporting = false;

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

  async exportPDF() {
    const element = document.getElementById('pdf-content');
    if (!element || !this.result) return;

    this.isExporting = true;

    // Scroll to top so html2canvas captures everything correctly
    window.scrollTo(0, 0);
    element.classList.add('pdf-capture');
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

      const title = this.result.listingTitle.replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`InternshipMatch_${title}_Report.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      element.classList.remove('pdf-capture');
      this.isExporting = false;
    }
  }
}