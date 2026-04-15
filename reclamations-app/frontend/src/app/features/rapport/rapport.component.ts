import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReclamationService } from '../../core/services/reclamation.service';
import { RapportSatisfaction } from '../../core/models';

@Component({
  selector: 'app-rapport',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="navbar-top">
      <h5 class="mb-0 fw-bold"><i class="bi bi-bar-chart me-2 text-primary"></i>Rapport de Satisfaction Client</h5>
    </div>

    <div *ngIf="rapport">
      <!-- KPIs -->
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="stat-card" style="background:linear-gradient(135deg,#1a237e,#3949ab)">
            <i class="bi bi-exclamation-circle fs-2 mb-2"></i>
            <div class="fs-3 fw-bold">{{ rapport.totalReclamations }}</div>
            <div class="small opacity-75">Total réclamations</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card" style="background:linear-gradient(135deg,#1b5e20,#388e3c)">
            <i class="bi bi-check-circle fs-2 mb-2"></i>
            <div class="fs-3 fw-bold">{{ rapport.reclamationsResolues }}</div>
            <div class="small opacity-75">Résolues</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card" style="background:linear-gradient(135deg,#e65100,#f57c00)">
            <i class="bi bi-percent fs-2 mb-2"></i>
            <div class="fs-3 fw-bold">{{ rapport.tauxResolution }}%</div>
            <div class="small opacity-75">Taux de résolution</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-card" style="background:linear-gradient(135deg,#880e4f,#c2185b)">
            <i class="bi bi-star-fill fs-2 mb-2"></i>
            <div class="fs-3 fw-bold">{{ rapport.noteMoyenne }}/5</div>
            <div class="small opacity-75">Note moyenne</div>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <!-- Par statut -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">Réclamations par statut</div>
            <div class="card-body">
              <div *ngFor="let entry of statutEntries" class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                  <span class="badge badge-{{ entry.key }}">{{ entry.key }}</span>
                  <span class="fw-bold">{{ entry.value }}</span>
                </div>
                <div class="progress" style="height:8px">
                  <div class="progress-bar" [style.width.%]="(entry.value / rapport.totalReclamations) * 100"
                       [class]="getProgressClass(entry.key)"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Par produit -->
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">Top produits réclamés</div>
            <div class="card-body">
              <div *ngFor="let entry of produitEntries; let i = index" class="d-flex align-items-center gap-3 mb-3">
                <div class="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                     style="width:32px;height:32px;min-width:32px;background:#1a237e;font-size:0.8rem">
                  {{ i + 1 }}
                </div>
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between">
                    <span>{{ entry.key }}</span>
                    <span class="fw-bold">{{ entry.value }}</span>
                  </div>
                  <div class="progress mt-1" style="height:6px">
                    <div class="progress-bar bg-primary" [style.width.%]="(entry.value / maxProduit) * 100"></div>
                  </div>
                </div>
              </div>
              <div *ngIf="produitEntries.length === 0" class="text-center text-muted">Aucune donnée</div>
            </div>
          </div>
        </div>

        <!-- Note satisfaction -->
        <div class="col-12">
          <div class="card">
            <div class="card-header">Satisfaction globale</div>
            <div class="card-body text-center">
              <div class="mb-2">
                <i *ngFor="let i of [1,2,3,4,5]" class="bi fs-2 me-1"
                   [class.bi-star-fill]="i <= rapport.noteMoyenne"
                   [class.bi-star-half]="i > rapport.noteMoyenne && i - 0.5 <= rapport.noteMoyenne"
                   [class.bi-star]="i > rapport.noteMoyenne + 0.5"
                   style="color:#ffc107"></i>
              </div>
              <p class="text-muted">Note moyenne de satisfaction : <strong>{{ rapport.noteMoyenne }}/5</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="!rapport" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>
  `
})
export class RapportComponent implements OnInit {
  rapport: RapportSatisfaction | null = null;

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    this.reclamationService.getRapport().subscribe(d => this.rapport = d);
  }

  get statutEntries() {
    if (!this.rapport) return [];
    return Object.entries(this.rapport.reclamationsParStatut).map(([key, value]) => ({ key, value }));
  }

  get produitEntries() {
    if (!this.rapport) return [];
    return Object.entries(this.rapport.reclamationsParProduit).map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value).slice(0, 5);
  }

  get maxProduit(): number {
    return Math.max(...this.produitEntries.map(e => e.value), 1);
  }

  getProgressClass(statut: string): string {
    const map: Record<string, string> = {
      'OUVERTE': 'bg-info', 'EN_COURS': 'bg-warning', 'RESOLUE': 'bg-success',
      'FERMEE': 'bg-secondary', 'REJETEE': 'bg-danger'
    };
    return map[statut] || 'bg-primary';
  }
}
