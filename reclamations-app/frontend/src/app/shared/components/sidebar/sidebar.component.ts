import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="sidebar d-flex flex-column">
      <div class="text-center py-3 mb-2">
        <i class="bi bi-shield-check fs-2"></i>
        <div class="fw-bold mt-1" style="font-size:0.9rem">Gestion Réclamations</div>
      </div>
      <hr class="border-secondary mx-3">

      <ul class="nav flex-column px-2 flex-grow-1">
        <!-- Menu CLIENT -->
        <ng-container *ngIf="isClient()">
          <li class="nav-item">
            <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
              <i class="bi bi-house-door"></i> Tableau de bord
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/mes-reclamations" routerLinkActive="active">
              <i class="bi bi-list-ul"></i> Mes réclamations
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/reclamation/nouvelle" routerLinkActive="active">
              <i class="bi bi-plus-circle"></i> Nouvelle réclamation
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/profile" routerLinkActive="active">
              <i class="bi bi-person"></i> Mon profil
            </a>
          </li>
        </ng-container>

        <!-- Menu AGENT SAV / ADMIN -->
        <ng-container *ngIf="auth.isAgent()">
          <li class="nav-item">
            <a class="nav-link" routerLink="/reclamations" routerLinkActive="active">
              <i class="bi bi-exclamation-circle"></i> Réclamations
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/clients" routerLinkActive="active">
              <i class="bi bi-people"></i> Clients
            </a>
          </li>
          <li class="nav-item" *ngIf="auth.isAdmin()">
            <a class="nav-link" routerLink="/agents" routerLinkActive="active">
              <i class="bi bi-person-badge"></i> Agents SAV
            </a>
          </li>
          <li class="nav-item" *ngIf="auth.isAdmin()">
            <a class="nav-link" routerLink="/admin" routerLinkActive="active">
              <i class="bi bi-shield-lock"></i> Administration
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/rapport" routerLinkActive="active">
              <i class="bi bi-bar-chart"></i> Rapport
            </a>
          </li>
        </ng-container>
      </ul>

      <div class="p-3 border-top border-secondary">
        <div class="d-flex align-items-center gap-2 mb-2">
          <i class="bi bi-person-circle fs-5"></i>
          <div>
            <div class="fw-semibold" style="font-size:0.85rem">{{ auth.currentUser?.nom }}</div>
            <div style="font-size:0.75rem; opacity:0.7">{{ getRoleLabel() }}</div>
          </div>
        </div>
        <button class="btn btn-outline-light btn-sm w-100" (click)="auth.logout()">
          <i class="bi bi-box-arrow-right"></i> Déconnexion
        </button>
      </div>
    </nav>
  `
})
export class SidebarComponent {
  constructor(public auth: AuthService) {}

  isClient(): boolean {
    return this.auth.currentUser?.role === 'ROLE_CLIENT';
  }

  getRoleLabel(): string {
    const role = this.auth.currentUser?.role;
    switch (role) {
      case 'ROLE_CLIENT': return 'Client';
      case 'ROLE_AGENT': return 'Agent SAV';
      case 'ROLE_ADMIN': return 'Administrateur';
      default: return role || '';
    }
  }
}
