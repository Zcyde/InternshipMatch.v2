import { Routes } from '@angular/router';
import { Login } from './login/login';
// Import other components as you create them

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Future routes based on your document:
  // { path: 'student-home', component: StudentHomeComponent },
  // { path: 'company-portal', component: CompanyPortalComponent }
];