import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReclamationService } from '../../core/services/reclamation.service';
import { AuthService } from '../../core/services/auth.service';
import { Reclamation, StatutReclamation } from '../../core/models';

@Component({
  selector: 'app-mes-reclamations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reclamations-container">
      <div class="header">
        <h1>Mes Réclamations</h1>
        <button class="btn-primary" (click)="createReclamation()">
          ➕ Nouvelle réclamation
        </button>
      </div>

      <div class="filters">
        <input 
          type="text" 
          placeholder="Rechercher par produit..." 
          [(ngModel)]="searchTerm"
          (ngModelChange)="filterReclamations()"
          class="search-input"
        />
        <select [(ngModel)]="filterStatut" (ngModelChange)="filterReclamations()" class="filter-select">
          <option value="">Tous les statuts</option>
          <option value="OUVERTE">Ouverte</option>
          <option value="EN_COURS">En cours</option>
          <option value="RESOLUE">Résolue</option>
          <option value="FERMEE">Fermée</option>
          <option value="REJETEE">Rejetée</option>
        </select>
      </div>

      <div class="reclamations-grid" *ngIf="filteredReclamations.length > 0; else noReclamations">
        <div class="reclamation-card" *ngFor="let rec of filteredReclamations" (click)="viewDetail(rec.id!)">
          <div class="card-header">
            <div class="card-title">
              <h3>{{ rec.produit }}</h3>
              <span class="reclamation-id">#{{ rec.id }}</span>
            </div>
            <span class="badge" [class]="'badge-' + rec.statut?.toLowerCase()">
              {{ getStatutLabel(rec.statut) }}
            </span>
          </div>

          <p class="description">{{ rec.description }}</p>

          <div class="card-footer">
            <div class="info-row">
              <span class="info-item">
                <span class="icon">📅</span>
                {{ formatDate(rec.date) }}
              </span>
              <span class="info-item" *ngIf="rec.agentNom">
                <span class="icon">👤</span>
                {{ rec.agentNom }}
              </span>
              <span class="info-item" *ngIf="rec.note">
                <span class="icon">⭐</span>
                {{ rec.note }}/5
              </span>
            </div>
            <button class="btn-view" (click)="viewDetail(rec.id!); $event.stopPropagation()">
              Voir détails →
            </button>
          </div>
        </div>
      </div>

      <ng-template #noReclamations>
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <h2>Aucune réclamation trouvée</h2>
          <p>{{ searchTerm || filterStatut ? 'Essayez de modifier vos filtres' : 'Commencez par créer votre première réclamation' }}</p>
          <button class="btn-primary" (click)="createReclamation()">Créer une réclamation</button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .reclamations-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      margin: 0;
      color: #1a1a2e;
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .search-input {
      flex: 1;
      min-width: 250px;
      padding: 0.75rem 1rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
    }

    .search-input:focus {
      outline: none;
      border-color: #3498db;
    }

    .filter-select {
      padding: 0.75rem 1rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      background: white;
      cursor: pointer;
    }

    .filter-select:focus {
      outline: none;
      border-color: #3498db;
    }

    .reclamations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .reclamation-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
    }

    .reclamation-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .card-title {
      flex: 1;
    }

    .card-title h3 {
      margin: 0 0 0.25rem 0;
      color: #1a1a2e;
      font-size: 1.2rem;
    }

    .reclamation-id {
      color: #999;
      font-size: 0.85rem;
    }

    .badge {
      padding: 0.35rem 0.85rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
      white-space: nowrap;
    }

    .badge-ouverte { background: #e3f2fd; color: #1976d2; }
    .badge-en_cours { background: #fff3e0; color: #f57c00; }
    .badge-resolue { background: #e8f5e9; color: #388e3c; }
    .badge-fermee { background: #f5f5f5; color: #616161; }
    .badge-rejetee { background: #ffebee; color: #d32f2f; }

    .description {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1rem;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-footer {
      border-top: 1px solid #f0f0f0;
      padding-top: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .info-row {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }

    .icon {
      font-size: 1rem;
    }

    .btn-view {
      background: #3498db;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background 0.2s;
      white-space: nowrap;
    }

    .btn-view:hover {
      background: #2980b9;
    }

    .btn-primary {
      background: #3498db;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.2s;
    }

    .btn-primary:hover {
      background: #2980b9;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h2 {
      color: #1a1a2e;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
      .reclamations-grid {
        grid-template-columns: 1fr;
      }

      .header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .filters {
        flex-direction: column;
      }

      .search-input {
        min-width: 100%;
      }
    }
  `]
})
export class MesReclamationsComponent implements OnInit {
  reclamations: Reclamation[] = [];
  filteredReclamations: Reclamation[] = [];
  searchTerm = '';
  filterStatut: StatutReclamation | '' = '';
  userName = '';

  constructor(
    private reclamationService: ReclamationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.userName = user.nom;
      this.loadReclamations();
    }
  }

  loadReclamations(): void {
    this.reclamationService.getAll().subscribe({
      next: (reclamations) => {
        // Filtrer les réclamations du client connecté
        this.reclamations = reclamations.filter(r => 
          r.clientNom === this.userName
        );
        this.filteredReclamations = [...this.reclamations];
      },
      error: (err) => console.error('Erreur chargement réclamations:', err)
    });
  }

  filterReclamations(): void {
    this.filteredReclamations = this.reclamations.filter(rec => {
      const matchSearch = !this.searchTerm || 
        rec.produit.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        rec.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchStatut = !this.filterStatut || rec.statut === this.filterStatut;
      
      return matchSearch && matchStatut;
    });
  }

  getStatutLabel(statut?: string): string {
    const labels: Record<string, string> = {
      'OUVERTE': 'Ouverte',
      'EN_COURS': 'En cours',
      'RESOLUE': 'Résolue',
      'FERMEE': 'Fermée',
      'REJETEE': 'Rejetée'
    };
    return statut ? labels[statut] || statut : '';
  }

  formatDate(date?: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  viewDetail(id: number): void {
    this.router.navigate(['/reclamation', id]);
  }

  createReclamation(): void {
    this.router.navigate(['/reclamation/nouvelle']);
  }
}
