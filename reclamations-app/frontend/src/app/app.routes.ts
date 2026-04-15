import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  // Routes CLIENT
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/client-dashboard/client-dashboard.component').then(m => m.ClientDashboardComponent)
  },
  {
    path: 'mes-reclamations',
    canActivate: [authGuard],
    loadComponent: () => import('./features/mes-reclamations/mes-reclamations.component').then(m => m.MesReclamationsComponent)
  },
  {
    path: 'reclamation/nouvelle',
    canActivate: [authGuard],
    loadComponent: () => import('./features/nouvelle-reclamation/nouvelle-reclamation.component').then(m => m.NouvelleReclamationComponent)
  },
  {
    path: 'reclamation/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/reclamation-detail/reclamation-detail.component').then(m => m.ReclamationDetailComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/client-profile/client-profile.component').then(m => m.ClientProfileComponent)
  },
  // Routes AGENT SAV (existantes)
  {
    path: 'reclamations',
    canActivate: [authGuard],
    loadComponent: () => import('./features/reclamations/reclamations.component').then(m => m.ReclamationsComponent)
  },
  {
    path: 'clients',
    canActivate: [authGuard],
    loadComponent: () => import('./features/clients/clients.component').then(m => m.ClientsComponent)
  },
  {
    path: 'agents',
    canActivate: [authGuard],
    loadComponent: () => import('./features/agents/agents.component').then(m => m.AgentsComponent)
  },
  {
    path: 'rapport',
    canActivate: [authGuard],
    loadComponent: () => import('./features/rapport/rapport.component').then(m => m.RapportComponent)
  },
  // Route ADMIN
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
