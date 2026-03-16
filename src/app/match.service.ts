import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface StudentSkill {
  name: string;
  proficiencyLevel: number;
}

export interface MatchResult {
  score: number;
  isReady: boolean;
  threshold: number;
  listingTitle: string;
  matchedSkills: {
    name: string;
    studentLevel: number;
    targetLevel: number;
    contribution: number;
  }[];
  missingSkills: {
    name: string;
    targetLevel: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private apiUrl = 'http://localhost:3000/api/match';

  constructor(private http: HttpClient) {}

  // Send student skills to backend, get compatibility result
  computeMatch(studentId: string, listingId: string, studentSkills: StudentSkill[]) {
    return this.http.post<any>(`${this.apiUrl}/compute`, {
      studentId,
      listingId,
      studentSkills
    });
  }

  // Get a student's past assessment history
  getHistory(studentId: string) {
    return this.http.get<any>(`${this.apiUrl}/history/${studentId}`);
  }
}
