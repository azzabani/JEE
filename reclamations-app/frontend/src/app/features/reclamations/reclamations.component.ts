import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ReclamationService } from '../../core/services/reclamation.service';
import { ClientService } from '../../core/services/client.service';
import { AgentService } from '../../core/services/agent.service';
import { SuiviService } from '../../core/services/suivi.service';
import { AuthService } from '../../core/services/auth.service';
import { Reclamation, Client, AgentSAV, SuiviReclamation, StatutReclamation } from '../../core/models';

@Component({
  selector: 'app-reclamations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="navbar-top d-flex justify-content-between align-items-center">
      <h5 class="mb-0 fw-bold"><i class="bi bi-exclamation-circle me-2 text-primary"></i>Réclamations</h5>
      <button class="btn btn-primary btn-sm" (click)="openModal()">
        <i class="bi bi-plus-lg me-1"></i>Nouvelle réclamation
      </button>
    </div>

    <!-- Filtres -->
    <div class="card mb-3">
      <div class="card-body py-2">
        <div class="row g-2 align-items-center">
          <div class="col-md-4">
            <input type="text" class="form-control form-control-sm" placeholder="Rechercher..." [(ngModel)]="search">
          </div>
          <div class="col-md-3">
            <select class="form-select form-select-sm" [(ngModel)]="filterStatut">
              <option value="">Tous les statuts</option>
              <option *ngFor="let s of statuts" [value]="s">{{ s }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="card">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>#</th><th>Client</th><th>Produit</th><th>Description</th>
                <th>Statut</th><th>Agent</th><th>Date</th><th>Note</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of filtered">
                <td>{{ r.id }}</td>
                <td>{{ r.clientNom }}</td>
                <td><span class="badge bg-secondary">{{ r.produit }}</span></td>
                <td><span title="{{ r.description }}">{{ r.description | slice:0:40 }}{{ r.description.length > 40 ? '...' : '' }}</span></td>
                <td><span class="badge badge-{{ r.statut }}">{{ r.statut }}</span></td>
                <td>{{ r.agentNom || 'Non affecté' }}</td>
                <td>{{ r.date | date:'dd/MM/yyyy' }}</td>
                <td>
                  <span *ngIf="r.note">
                    <i *ngFor="let i of [1,2,3,4,5]" class="bi" [class.bi-star-fill]="i <= r.note!" [class.bi-star]="i > r.note!" style="color:#ffc107;font-size:0.8rem"></i>
                  </span>
                  <span *ngIf="!r.note" class="text-muted">-</span>
                </td>
                <td>
                  <div class="d-flex gap-1">
                    <button class="btn btn-xs btn-outline-info" title="Suivi" (click)="openSuivi(r)"><i class="bi bi-clock-history"></i></button>
                    <button class="btn btn-xs btn-outline-primary" title="Modifier" (click)="edit(r)"><i class="bi bi-pencil"></i></button>
                    <button *ngIf="auth.isAgent()" class="btn btn-xs btn-outline-success" title="Affecter" (click)="openAffecter(r)"><i class="bi bi-person-check"></i></button>
                    <button *ngIf="auth.isAdmin()" class="btn btn-xs btn-outline-danger" title="Supprimer" (click)="delete(r.id!)"><i class="bi bi-trash"></i></button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filtered.length === 0">
                <td colspan="9" class="text-center text-muted py-4">Aucune réclamation trouvée</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Réclamation -->
    <div class="modal fade show d-block" *ngIf="showModal" style="background:rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editing ? 'Modifier' : 'Nouvelle' }} réclamation</h5>
            <button type="button" class="btn-close" (click)="closeModal()"></button>
          </div>
          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Client *</label>
                  <select class="form-select" formControlName="clientId">
                    <option value="">Sélectionner un client</option>
                    <option *ngFor="let c of clients" [value]="c.id">{{ c.nom }}</option>
                  </select>
                  <div *ngIf="f['clientId'].touched && f['clientId'].invalid" class="text-danger small">Client requis</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Produit *</label>
                  <input type="text" class="form-control" formControlName="produit">
                  <div *ngIf="f['produit'].touched && f['produit'].invalid" class="text-danger small">Produit requis</div>
                </div>
                <div class="col-12">
                  <label class="form-label">Description *</label>
                  <textarea class="form-control" rows="3" formControlName="description"></textarea>
                  <div *ngIf="f['description'].touched && f['description'].invalid" class="text-danger small">Description requise (min. 10 caractères)</div>
                </div>
                <div class="col-md-6" *ngIf="editing">
                  <label class="form-label">Statut</label>
                  <select class="form-select" formControlName="statut">
                    <option *ngFor="let s of statuts" [value]="s">{{ s }}</option>
                  </select>
                </div>
                <div class="col-md-6" *ngIf="editing">
                  <label class="form-label">Note de satisfaction (1-5)</label>
                  <input type="number" class="form-control" formControlName="note" min="1" max="5">
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn btn-primary" [disabled]="loading">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Affecter -->
    <div class="modal fade show d-block" *ngIf="showAffecterModal" style="background:rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Affecter à un agent SAV</h5>
            <button type="button" class="btn-close" (click)="showAffecterModal = false"></button>
          </div>
          <div class="modal-body">
            <label class="form-label">Sélectionner un agent</label>
            <select class="form-select" [(ngModel)]="selectedAgentId">
              <option value="">-- Choisir un agent --</option>
              <option *ngFor="let a of agents" [value]="a.id">{{ a.nom }} ({{ a.competence }})</option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="showAffecterModal = false">Annuler</button>
            <button class="btn btn-success" (click)="affecter()" [disabled]="!selectedAgentId">Affecter</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Suivi -->
    <div class="modal fade show d-block" *ngIf="showSuiviModal" style="background:rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Suivi - Réclamation #{{ selectedReclamation?.id }}</h5>
            <button type="button" class="btn-close" (click)="showSuiviModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3" style="max-height:300px;overflow-y:auto">
              <div *ngFor="let s of suivis" class="border rounded p-3 mb-2">
                <div class="d-flex justify-content-between">
                  <span class="fw-semibold">{{ s.employe }}</span>
                  <small class="text-muted">{{ s.date | date:'dd/MM/yyyy HH:mm' }}</small>
                </div>
                <span class="badge bg-secondary me-2">{{ s.action }}</span>
                <p class="mb-0 mt-1">{{ s.message }}</p>
              </div>
              <div *ngIf="suivis.length === 0" class="text-center text-muted py-3">Aucun suivi enregistré</div>
            </div>
            <hr>
            <form [formGroup]="suiviForm" (ngSubmit)="addSuivi()" *ngIf="auth.isAgent()">
              <div class="row g-2">
                <div class="col-md-6">
                  <input type="text" class="form-control form-control-sm" placeholder="Employé *" formControlName="employe">
                </div>
                <div class="col-md-6">
                  <input type="text" class="form-control form-control-sm" placeholder="Action *" formControlName="action">
                </div>
                <div class="col-12">
                  <textarea class="form-control form-control-sm" rows="2" placeholder="Message *" formControlName="message"></textarea>
                </div>
                <div class="col-12">
                  <button type="submit" class="btn btn-primary btn-sm">Ajouter le suivi</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`.btn-xs { padding: 2px 6px; font-size: 0.75rem; }`]
})
export class ReclamationsComponent implements OnInit {
  reclamations: Reclamation[] = [];
  clients: Client[] = [];
  agents: AgentSAV[] = [];
  suivis: SuiviReclamation[] = [];
  statuts: StatutReclamation[] = ['OUVERTE', 'EN_COURS', 'RESOLUE', 'FERMEE', 'REJETEE'];

  search = '';
  filterStatut = '';
  showModal = false;
  showAffecterModal = false;
  showSuiviModal = false;
  editing: Reclamation | null = null;
  selectedReclamation: Reclamation | null = null;
  selectedAgentId: number | '' = '';
  loading = false;

  form: FormGroup;
  suiviForm: FormGroup;

  constructor(
    private reclamationService: ReclamationService,
    private clientService: ClientService,
    private agentService: AgentService,
    private suiviService: SuiviService,
    public auth: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      clientId: ['', Validators.required],
      produit: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      statut: [''],
      note: [null]
    });
    this.suiviForm = this.fb.group({
      employe: ['', Validators.required],
      action: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  get filtered() {
    return this.reclamations.filter(r => {
      const matchSearch = !this.search ||
        r.clientNom?.toLowerCase().includes(this.search.toLowerCase()) ||
        r.produit.toLowerCase().includes(this.search.toLowerCase());
      const matchStatut = !this.filterStatut || r.statut === this.filterStatut;
      return matchSearch && matchStatut;
    });
  }

  ngOnInit(): void {
    this.load();
    this.clientService.getAll().subscribe(d => this.clients = d);
    this.agentService.getAll().subscribe(d => this.agents = d);
  }

  load(): void { this.reclamationService.getAll().subscribe(d => this.reclamations = d); }

  openModal(): void { this.editing = null; this.form.reset(); this.showModal = true; }

  edit(r: Reclamation): void {
    this.editing = r;
    this.form.patchValue({ clientId: r.clientId, produit: r.produit, description: r.description, statut: r.statut, note: r.note });
    this.showModal = true;
  }

  closeModal(): void { this.showModal = false; this.editing = null; }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const data = { ...this.form.value, clientId: +this.form.value.clientId };
    const obs = this.editing
      ? this.reclamationService.update(this.editing.id!, data)
      : this.reclamationService.create(data);
    obs.subscribe({ next: () => { this.load(); this.closeModal(); this.loading = false; }, error: () => this.loading = false });
  }

  delete(id: number): void {
    if (confirm('Supprimer cette réclamation ?')) {
      this.reclamationService.delete(id).subscribe(() => this.load());
    }
  }

  openAffecter(r: Reclamation): void {
    this.selectedReclamation = r;
    this.selectedAgentId = r.agentId || '';
    this.showAffecterModal = true;
  }

  affecter(): void {
    if (!this.selectedReclamation || !this.selectedAgentId) return;
    this.reclamationService.affecter(this.selectedReclamation.id!, +this.selectedAgentId).subscribe(() => {
      this.load();
      this.showAffecterModal = false;
    });
  }

  openSuivi(r: Reclamation): void {
    this.selectedReclamation = r;
    this.suiviForm.reset();
    this.suiviService.getByReclamation(r.id!).subscribe(d => this.suivis = d);
    this.showSuiviModal = true;
  }

  addSuivi(): void {
    if (this.suiviForm.invalid || !this.selectedReclamation) return;
    const suivi: SuiviReclamation = { ...this.suiviForm.value, reclamationId: this.selectedReclamation.id };
    this.suiviService.create(suivi).subscribe(() => {
      this.suiviService.getByReclamation(this.selectedReclamation!.id!).subscribe(d => this.suivis = d);
      this.suiviForm.reset();
    });
  }
}
