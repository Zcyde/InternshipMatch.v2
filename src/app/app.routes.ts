import { Routes } from '@angular/router';
import { Login } from './login/login';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin-shell/admin-shell')
        .then(m => m.AdminShell),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard')
            .then(m => m.Dashboard)
      },
      {
        path: 'listings',
        loadComponent: () =>
          import('./features/admin/listings/listings')
            .then(m => m.Listings)
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./features/admin/skills/skills')
            .then(m => m.Skills)
      }
    ]
  },
  {
    path: 'student',
    loadComponent: () =>
      import('./features/student/student-shell/student-shell')
        .then(m => m.StudentShell),
    children: [
      { path: '', redirectTo: 'listings', pathMatch: 'full' },
      {
        path: 'listings',
        loadComponent: () =>
          import('./features/student/listings-browse/listings-browse')
            .then(m => m.ListingsBrowse)
      },
      {
        path: 'skill-input/:roleId',
        loadComponent: () =>
          import('./features/student/skill-input/skill-input')
            .then(m => m.SkillInput)
      },
      {
        path: 'result/:roleId',
        loadComponent: () =>
          import('./features/student/match-result/match-result')
            .then(m => m.MatchResult)
      },
      {
        path: 'roadmap/:roleId',
        loadComponent: () =>
          import('./features/student/roadmap/roadmap')
            .then(m => m.Roadmap)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];