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
  
  // Properties for the PDF Report
  userName: string = '';
  today: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.roleId = this.route.snapshot.paramMap.get('roleId') || '';
    
    // 1. Retrieve the name from sessionStorage
    const savedName = sessionStorage.getItem('fullName');

    // 2. FIXED LOGIC: Check if name exists and isn't literally the string "undefined"
    if (savedName && savedName !== 'undefined' && savedName !== 'null') {
      this.userName = savedName;
    } else {
      // Fallback if the session hasn't updated yet
      this.userName = 'Student'; 
    }

    // 3. Load the matching results
    const stored = sessionStorage.getItem('matchResult');
    if (stored) {
      this.result = JSON.parse(stored);
    } else {
      // If no result exists, redirect back to selection
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

    // Preparation for capture
    window.scrollTo(0, 0);
    element.classList.add('pdf-capture');
    
    // Small delay to ensure styles and name are rendered
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add a 10mm margin
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

      // Save with the User's Name in the filename
      const safeName = this.userName.replace(/\s+/g, '_');
      const safeTitle = this.result.listingTitle.replace(/\s+/g, '_');
      pdf.save(`${safeName}_${safeTitle}_Result.pdf`);

    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      element.classList.remove('pdf-capture');
      this.isExporting = false;
    }
  }
}