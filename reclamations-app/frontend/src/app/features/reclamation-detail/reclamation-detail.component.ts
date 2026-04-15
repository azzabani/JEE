import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReclamationService } from '../../core/services/reclamation.service';
import { SuiviService } from '../../core/services/suivi.service';
import { AuthService } from '../../core/services/auth.service';
import { Reclamation, SuiviReclamation } from '../../core/models';

@Component({
  selector: 'app-reclamation-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="detail-container" *ngIf="reclamation">
      <div class="header">
        <button class="btn-back" (click)="goBack()">← Retour</button>
        <h1>Réclamation #{{ reclamation.id }}</h1>
      </div>

      <div class="content-grid">
        <!-- Informations principales -->
        <div class="main-info">
          <div class="info-card">
            <div class="card-header">
              <h2>Informations</h2>
              <span class="badge" [class]="'badge-' + reclamation.statut?.toLowerCase()">
                {{ getStatutLabel(reclamation.statut) }}
              </span>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <label>Produit</label>
                <p>{{ reclamation.produit }}</p>
              </div>

              <div class="info-item">
                <label>Date de création</label>
                <p>{{ formatDate(reclamation.date) }}</p>
              </div>

              <div class="info-item full-width">
                <label>Description</label>
                <p class="description">{{ reclamation.description }}</p>
              </div>

              <div class="info-item">
                <label>Agent assigné</label>
                <p>👤 {{ reclamation.agentNom || 'Non affecté' }}</p>
              </div>

              <div class="info-item" *ngIf="reclamation.note">
                <label>Note de satisfaction</label>
                <p class="rating">
                  <span *ngFor="let star of [1,2,3,4,5]" class="star" [class.filled]="star <= (reclamation.note || 0)">
                    ⭐
                  </span>
                  {{ reclamation.note }}/5
                </p>
              </div>
            </div>

            <!-- Évaluation si résolue -->
            <div class="rating-section" *ngIf="reclamation.statut === 'RESOLUE' && !reclamation.note">
              <h3>Évaluer cette réclamation</h3>
              <div class="rating-input">
                <span *ngFor="let star of [1,2,3,4,5]" 
                      class="star-input" 
                      [class.filled]="star <= selectedRating"
                      (click)="setRating(star)"
                      (mouseenter)="hoverRating = star"
                      (mouseleave)="hoverRating = 0">
                  ⭐
                </span>
              </div>
              <button class="btn-primary" (click)="submitRating()" [disabled]="!selectedRating">
                Soumettre l'évaluation
              </button>
            </div>
          </div>
        </div>

        <!-- Timeline des suivis -->
        <div class="timeline-section">
          <div class="timeline-card">
            <h2>Historique et suivi</h2>

            <div class="timeline" *ngIf="suivis.length > 0; else noSuivis">
              <div class="timeline-item" *ngFor="let suivi of suivis; let last = last">
                <div class="timeline-marker"></div>
                <div class="timeline-content" [class.last]="last">
                  <div class="timeline-header">
                    <span class="timeline-action">{{ suivi.action }}</span>
                    <span class="timeline-date">{{ formatDateTime(suivi.date) }}</span>
                  </div>
                  <p class="timeline-message">{{ suivi.message }}</p>
                  <span class="timeline-author">Par: {{ suivi.employe }}</span>
                </div>
              </div>
            </div>

            <ng-template #noSuivis>
              <div class="empty-timeline">
                <p>Aucun suivi pour le moment</p>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </div>

    <div class="loading" *ngIf="!reclamation">
      <div class="spinner"></div>
      <p>Chargement...</p>
    </div>
  `,
  styles: [`
    .detail-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .header h1 {
      margin: 0;
      color: #1a1a2e;
    }

    .btn-back {
      background: white;
      border: 1px solid #ddd;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s;
    }

    .btn-back:hover {
      background: #f8f9fa;
      border-color: #3498db;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .info-card, .timeline-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .card-header h2 {
      margin: 0;
      color: #1a1a2e;
    }

    .badge {
      padding: 0.35rem 0.85rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .badge-ouverte { background: #e3f2fd; color: #1976d2; }
    .badge-en_cours { background: #fff3e0; color: #f57c00; }
    .badge-resolue { background: #e8f5e9; color: #388e3c; }
    .badge-fermee { background: #f5f5f5; color: #616161; }
    .badge-rejetee { background: #ffebee; color: #d32f2f; }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .info-item.full-width {
      grid-column: 1 / -1;
    }

    .info-item label {
      font-weight: 600;
      color: #666;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-item p {
      margin: 0;
      color: #1a1a2e;
      font-size: 1.1rem;
    }

    .description {
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .star {
      font-size: 1.2rem;
      filter: grayscale(100%);
    }

    .star.filled {
      filter: grayscale(0%);
    }

    .rating-section {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e0e0e0;
    }

    .rating-section h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #1a1a2e;
    }

    .rating-input {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .star-input {
      font-size: 2rem;
      cursor: pointer;
      transition: all 0.2s;
      filter: grayscale(100%);
    }

    .star-input.filled {
      filter: grayscale(0%);
      transform: scale(1.1);
    }

    .star-input:hover {
      transform: scale(1.2);
    }

    .timeline-card h2 {
      margin-top: 0;
      margin-bottom: 1.5rem;
      color: #1a1a2e;
    }

    .timeline {
      position: relative;
      padding-left: 2rem;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 0.5rem;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #e0e0e0;
    }

    .timeline-item {
      position: relative;
      margin-bottom: 2rem;
    }

    .timeline-marker {
      position: absolute;
      left: -1.5rem;
      top: 0.25rem;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      background: #3498db;
      border: 3px solid white;
      box-shadow: 0 0 0 2px #3498db;
    }

    .timeline-content {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      border-left: 3px solid #3498db;
    }

    .timeline-content.last {
      background: #e8f5e9;
      border-left-color: #27ae60;
    }

    .timeline-content.last .timeline-marker {
      background: #27ae60;
      box-shadow: 0 0 0 2px #27ae60;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .timeline-action {
      font-weight: 600;
      color: #1a1a2e;
    }

    .timeline-date {
      font-size: 0.85rem;
      color: #999;
    }

    .timeline-message {
      margin: 0.5rem 0;
      color: #666;
      line-height: 1.5;
    }

    .timeline-author {
      font-size: 0.85rem;
      color: #999;
      font-style: italic;
    }

    .empty-timeline {
      text-align: center;
      padding: 2rem;
      color: #999;
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

    .btn-primary:hover:not(:disabled) {
      background: #2980b9;
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      color: #666;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReclamationDetailComponent implements OnInit {
  reclamation: Reclamation | null = null;
  suivis: SuiviReclamation[] = [];
  selectedRating = 0;
  hoverRating = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reclamationService: ReclamationService,
    private suiviService: SuiviService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadReclamation(+id);
      this.loadSuivis(+id);
    }
  }

  loadReclamation(id: number): void {
    this.reclamationService.getById(id).subscribe({
      next: (rec) => {
        this.reclamation = rec;
        this.selectedRating = rec.note || 0;
      },
      error: (err) => {
        console.error('Erreur chargement réclamation:', err);
        this.router.navigate(['/mes-reclamations']);
      }
    });
  }

  loadSuivis(reclamationId: number): void {
    this.suiviService.getByReclamation(reclamationId).subscribe({
      next: (suivis) => {
        this.suivis = suivis.sort((a, b) => 
          new Date(b.date || '').getTime() - new Date(a.date || '').getTime()
        );
      },
      error: (err) => console.error('Erreur chargement suivis:', err)
    });
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
  }

  submitRating(): void {
    if (!this.reclamation || !this.selectedRating) return;

    const updatedReclamation = { ...this.reclamation, note: this.selectedRating };
    this.reclamationService.update(this.reclamation.id!, updatedReclamation).subscribe({
      next: (rec) => {
        this.reclamation = rec;
        alert('Merci pour votre évaluation !');
      },
      error: (err) => console.error('Erreur soumission note:', err)
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

  formatDateTime(date?: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goBack(): void {
    this.router.navigate(['/mes-reclamations']);
  }
}
