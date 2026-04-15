import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReclamationService } from '../../core/services/reclamation.service';
import { ClientService } from '../../core/services/client.service';
import { AuthService } from '../../core/services/auth.service';
import { Reclamation } from '../../core/models';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Bienvenue, {{ userName }}</h1>
        <p class="subtitle">Tableau de bord personnel</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <h3>{{ stats.total }}</h3>
            <p>Total réclamations</p>
          </div>
        </div>

        <div class="stat-card pending">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <h3>{{ stats.enCours }}</h3>
            <p>En cours</p>
          </div>
        </div>

        <div class="stat-card resolved">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>{{ stats.resolues }}</h3>
            <p>Résolues</p>
          </div>
        </div>

        <div class="stat-card rating">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <h3>{{ stats.noteMoyenne }}/5</h3>
            <p>Note moyenne</p>
          </div>
        </div>
      </div>

      <div class="recent-section">
        <div class="section-header">
          <h2>Réclamations récentes</h2>
          <button class="btn-primary" (click)="goToReclamations()">Voir tout</button>
        </div>

        <div class="reclamations-list" *ngIf="recentReclamations.length > 0; else noReclamations">
          <div class="reclamation-card" *ngFor="let rec of recentReclamations" (click)="viewDetail(rec.id!)">
            <div class="reclamation-header">
              <h3>{{ rec.produit }}</h3>
              <span class="badge" [class]="'badge-' + rec.statut?.toLowerCase()">
                {{ getStatutLabel(rec.statut) }}
              </span>
            </div>
            <p class="reclamation-desc">{{ rec.description }}</p>
            <div class="reclamation-footer">
              <span class="date">{{ formatDate(rec.date) }}</span>
              <span class="agent" *ngIf="rec.agentNom">Agent: {{ rec.agentNom }}</span>
            </div>
          </div>
        </div>

        <ng-template #noReclamations>
          <div class="empty-state">
            <p>Aucune réclamation pour le moment</p>
            <button class="btn-primary" (click)="createReclamation()">Créer une réclamation</button>
          </div>
        </ng-template>
      </div>

      <div class="quick-actions">
        <h2>Actions rapides</h2>
        <div class="actions-grid">
          <button class="action-btn" (click)="createReclamation()">
            <span class="action-icon">➕</span>
            <span>Nouvelle réclamation</span>
          </button>
          <button class="action-btn" (click)="goToReclamations()">
            <span class="action-icon">📝</span>
            <span>Mes réclamations</span>
          </button>
          <button class="action-btn" (click)="goToProfile()">
            <span class="action-icon">👤</span>
            <span>Mon profil</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      color: #1a1a2e;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #666;
      font-size: 1.1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .stat-card.total { border-left: 4px solid #3498db; }
    .stat-card.pending { border-left: 4px solid #f39c12; }
    .stat-card.resolved { border-left: 4px solid #27ae60; }
    .stat-card.rating { border-left: 4px solid #9b59b6; }

    .stat-icon {
      font-size: 2.5rem;
    }

    .stat-content h3 {
      font-size: 2rem;
      margin: 0;
      color: #1a1a2e;
    }

    .stat-content p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .recent-section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h2 {
      margin: 0;
      color: #1a1a2e;
    }

    .reclamations-list {
      display: grid;
      gap: 1rem;
    }

    .reclamation-card {
      padding: 1.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .reclamation-card:hover {
      border-color: #3498db;
      box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
    }

    .reclamation-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .reclamation-header h3 {
      margin: 0;
      color: #1a1a2e;
      font-size: 1.1rem;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .badge-ouverte { background: #e3f2fd; color: #1976d2; }
    .badge-en_cours { background: #fff3e0; color: #f57c00; }
    .badge-resolue { background: #e8f5e9; color: #388e3c; }
    .badge-fermee { background: #f5f5f5; color: #616161; }
    .badge-rejetee { background: #ffebee; color: #d32f2f; }

    .reclamation-desc {
      color: #666;
      margin: 0.5rem 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .reclamation-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      font-size: 0.9rem;
      color: #999;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #999;
    }

    .empty-state p {
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .quick-actions {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .quick-actions h2 {
      margin-top: 0;
      margin-bottom: 1.5rem;
      color: #1a1a2e;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 1rem;
    }

    .action-btn:hover {
      background: #3498db;
      border-color: #3498db;
      color: white;
      transform: translateY(-2px);
    }

    .action-icon {
      font-size: 2rem;
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
  `]
})
export class ClientDashboardComponent implements OnInit {
  userName = '';
  clientId: number | null = null;
  recentReclamations: Reclamation[] = [];
  stats = {
    total: 0,
    enCours: 0,
    resolues: 0,
    noteMoyenne: 0
  };

  constructor(
    private reclamationService: ReclamationService,
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user && user.email) {
      this.userName = user.nom;
      // Charger le client par email pour obtenir l'ID
      this.clientService.getByEmail(user.email).subscribe({
        next: (client) => {
          if (client && client.id) {
            this.clientId = client.id;
            this.loadClientData();
          }
        },
        error: (err) => {
          console.error('Erreur chargement client:', err);
          // Charger quand même les données en filtrant par nom
          this.loadClientData();
        }
      });
    }
  }

  loadClientData(): void {
    // Charger toutes les réclamations et filtrer par client
    this.reclamationService.getAll().subscribe({
      next: (reclamations) => {
        // Filtrer les réclamations du client connecté
        const myReclamations = reclamations.filter(r => 
          r.clientNom === this.userName || r.clientId === this.clientId
        );
        
        this.stats.total = myReclamations.length;
        this.stats.enCours = myReclamations.filter(r => 
          r.statut === 'OUVERTE' || r.statut === 'EN_COURS'
        ).length;
        this.stats.resolues = myReclamations.filter(r => 
          r.statut === 'RESOLUE' || r.statut === 'FERMEE'
        ).length;
        
        const notedReclamations = myReclamations.filter(r => r.note);
        this.stats.noteMoyenne = notedReclamations.length > 0
          ? Math.round(notedReclamations.reduce((sum, r) => sum + (r.note || 0), 0) / notedReclamations.length * 10) / 10
          : 0;

        // Prendre les 5 réclamations les plus récentes
        this.recentReclamations = myReclamations
          .sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime())
          .slice(0, 5);
      },
      error: (err) => console.error('Erreur chargement réclamations:', err)
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
      month: 'short',
      year: 'numeric'
    });
  }

  viewDetail(id: number): void {
    this.router.navigate(['/reclamation', id]);
  }

  goToReclamations(): void {
    this.router.navigate(['/mes-reclamations']);
  }

  createReclamation(): void {
    this.router.navigate(['/reclamation/nouvelle']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
