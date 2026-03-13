import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Login } from './login/login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  public auth: Login = inject(Login);

  // -----------------------
  // AUTH STATE
  // -----------------------
  nameInput = "";
  passInput = "";
  loginError = false;
  loginErrorMessage = "";
  isSignupMode = false;

  // -----------------------
  // UI STATE
  // -----------------------
  sInput = "";
  rInput = "";
  selectedPreset = 'Full-Stack Dev';
  thresholdValue = 75;

  // -----------------------
  // STUDENT SKILLS
  // -----------------------
  sSkillsObj: { name: string, level: number }[] = [
    { name: "Node.js", level: 2 },
    { name: "SQL", level: 3 },
    { name: "JavaScript", level: 2 }
  ];

  // -----------------------
  // INTERNSHIP REQUIREMENTS
  // -----------------------
  rSkills: string[] = [
    "React",
    "Node.js",
    "MongoDB",
    "REST APIs",
    "Git",
    "JavaScript",
    "HTML/CSS"
  ];

  presets = [
    { name: 'Full-Stack Dev', skills: ["React", "Node.js", "MongoDB", "REST APIs", "Git", "JavaScript", "HTML/CSS"] },
    { name: 'Data Science', skills: ["Python", "SQL", "Pandas", "Machine Learning", "Statistics"] },
    { name: 'Mobile Dev', skills: ["Flutter", "Dart", "Firebase", "iOS", "Android"] }
  ];

  sQuickAdd = [
    "React", "Angular", "Java", "MongoDB", "Git", "HTML/CSS", "TypeScript", "Figma", "Flutter", "Linux"
  ];

  // -----------------------
  // ADMIN QUICK ACCESS
  // -----------------------
  adminQuickAccess() {
    this.nameInput = "admin";
    this.passInput = "admin123";
    this.tryAuth();
  }

  // -----------------------
  // AUTHENTICATION FUNCTION
  // -----------------------
  async tryAuth() {
    if (!this.nameInput || !this.passInput) return;

    const endpoint = this.isSignupMode ? "register" : "login";

    try {
      console.log("Sending request to:", `http://localhost:3000/api/${endpoint}`);
      console.log("Request body:", { username: this.nameInput, password: this.passInput });

      const response = await fetch(`http://localhost:3000/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: this.nameInput, password: this.passInput })
      });

      const data = await response.json().catch(() => null);
      console.log("Server Response:", data, "Status:", response.status);

      if (response.ok) {
        if (this.isSignupMode) {
          // Success for Registration
          alert(data?.message || "Registration successful! You can now login.");
          this.isSignupMode = false;
          this.loginError = false;
        } else if (data?.status === "success" || data?.role) {
          // Success for Login
          if (data.role === "admin") this.auth.isAdmin.set(true);
          else this.auth.isUser.set(true);
          this.loginError = false;
        }
      } else {
        // Handle 400/401/500 errors
        this.loginError = true;
        this.loginErrorMessage = data?.message || "Authentication failed";
        alert(this.loginErrorMessage);
      }

    } catch (err) {
      console.error("Auth Error:", err);
      this.loginError = true;
      this.loginErrorMessage = "Network or server error occurred. Please try again.";
      alert(this.loginErrorMessage);
    }

    this.passInput = ""; // Clear password field for security
  }

  // -----------------------
  // SKILL MATCHING
  // -----------------------
  get sSkills(): string[] {
    return this.sSkillsObj.map(s => s.name);
  }

  get matched(): string[] {
    const sLow = this.sSkills.map(s => s.toLowerCase());
    return this.rSkills.filter(r => sLow.includes(r.toLowerCase()));
  }

  get missing(): string[] {
    const sLow = this.sSkills.map(s => s.toLowerCase());
    return this.rSkills.filter(r => !sLow.includes(r.toLowerCase()));
  }

  get extra(): string[] {
    const rLow = this.rSkills.map(r => r.toLowerCase());
    return this.sSkills.filter(s => !rLow.includes(s.toLowerCase()));
  }

  // -----------------------
  // READINESS SCORE
  // -----------------------
  get score(): number {
    if (!this.rSkills.length) return 0;

    let earnedPoints = 0;
    const maxPoints = this.rSkills.length * 3;

    this.sSkillsObj.forEach(skill => {
      if (this.rSkills.some(r => r.toLowerCase() === skill.name.toLowerCase())) {
        earnedPoints += Number(skill.level);
      }
    });

    return Math.min(Math.round((earnedPoints / maxPoints) * 100), 100);
  }

  get isReady(): boolean {
    return this.score >= this.thresholdValue;
  }

  // -----------------------
  // SKILL MANAGEMENT
  // -----------------------
  addSkill(type: 's' | 'r', val?: string) {
    const skillName = (val || (type === 's' ? this.sInput : this.rInput)).trim();
    if (!skillName) return;

    if (type === 's') {
      if (!this.sSkills.includes(skillName)) this.sSkillsObj.push({ name: skillName, level: 1 });
      this.sInput = "";
    } else {
      if (!this.rSkills.includes(skillName)) this.rSkills.push(skillName);
      this.rInput = "";
    }
  }

  removeSkill(type: 's' | 'r', skillName: string) {
    if (type === 's') this.sSkillsObj = this.sSkillsObj.filter(s => s.name !== skillName);
    else this.rSkills = this.rSkills.filter(r => r !== skillName);
  }

  setPreset(p: any) {
    this.selectedPreset = p.name;
    this.rSkills = [...p.skills];
  }

  calculateWeightedScore() {
    // Trigger Angular change detection
  }

  exportPDF() {
    alert("Generating Internship Readiness Report for HAU School of Computing...");
  }
}