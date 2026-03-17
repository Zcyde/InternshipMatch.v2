import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListingService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // ── STUDENT ──────────────────────────────────────────

  // Get all published listings (student role selection page)
  getPublishedListings() {
    return this.http.get<any>(`${this.apiUrl}/listings/published`);
  }

  // Get skills for a specific listing (student skill input page)
  getSkillsByListing(listingId: string) {
    return this.http.get<any>(`${this.apiUrl}/skills/${listingId}`);
  }

  // ── ADMIN ─────────────────────────────────────────────

  // Get all listings including unpublished
  getAllListings() {
    return this.http.get<any>(`${this.apiUrl}/listings`);
  }

  // Get single listing
  getListing(id: string) {
    return this.http.get<any>(`${this.apiUrl}/listings/${id}`);
  }

  // Create new listing
  createListing(data: { title: string; description: string; threshold: number; isPublished: boolean }) {
  return this.http.post<any>(`${this.apiUrl}/listings`, data);
}

  // Update listing
  updateListing(id: string, data: any) {
    return this.http.put<any>(`${this.apiUrl}/listings/${id}`, data);
  }

  // Delete listing
  deleteListing(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/listings/${id}`);
  }

  // Add skill to a listing
  addSkill(data: {
    name: string;
    listing: string;
    weight: number;
    targetLevel: number;
    resources?: { label: string; url: string }[];
  }) {
    return this.http.post<any>(`${this.apiUrl}/skills`, data);
  }

  // Update skill
  updateSkill(id: string, data: any) {
    return this.http.put<any>(`${this.apiUrl}/skills/${id}`, data);
  }

  // Delete skill
  deleteSkill(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/skills/${id}`);
  }
}