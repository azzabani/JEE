import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AgentService } from '../../core/services/agent.service';
import { AgentSAV } from '../../core/models';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="navbar-top d-flex justify-content-between align-items-center">
      <h5 class="mb-0 fw-bold"><i class="bi bi-person-badge me-2 text-primary"></i>Agents SAV</h5>
      <button class="btn btn-primary btn-sm" (click)="openModal()">
        <i class="bi bi-plus-lg me-1"></i>Nouvel agent
      </button>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-4" *ngFor="let a of agents">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex align-items-center gap-3 mb-3">
              <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style="width:48px;height:48px;font-size:1.2rem">
                {{ a.nom.charAt(0).toUpperCase() }}
              </div>
              <div>
                <div class="fw-bold">{{ a.nom }}</div>
                <span class="badge bg-info text-dark">{{ a.competence }}</span>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-primary flex-grow-1" (click)="edit(a)"><i class="bi bi-pencil me-1"></i>Modifier</button>
              <button class="btn btn-sm btn-outline-danger" (click)="delete(a.id!)"><i class="bi bi-trash"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12" *ngIf="agents.length === 0">
        <div class="text-center text-muted py-5">Aucun agent SAV enregistré</div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade show d-block" *ngIf="showModal" style="background:rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editing ? 'Modifier' : 'Nouvel' }} agent SAV</h5>
            <button type="button" class="btn-close" (click)="closeModal()"></button>
          </div>
          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Nom *</label>
                <input type="text" class="form-control" formControlName="nom">
                <div *ngIf="f['nom'].touched && f['nom'].invalid" class="text-danger small">Nom requis</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Compétence *</label>
                <input type="text" class="form-control" formControlName="competence" placeholder="Ex: Technique, Commercial...">
                <div *ngIf="f['competence'].touched && f['competence'].invalid" class="text-danger small">Compétence requise</div>
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
  `
})
export class AgentsComponent implements OnInit {
  agents: AgentSAV[] = [];
  showModal = false;
  editing: AgentSAV | null = null;
  form: FormGroup;
  loading = false;

  constructor(private agentService: AgentService, private fb: FormBuilder) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      competence: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }
  ngOnInit(): void { this.load(); }
  load(): void { this.agentService.getAll().subscribe(data => this.agents = data); }
  openModal(): void { this.editing = null; this.form.reset(); this.showModal = true; }
  edit(a: AgentSAV): void { this.editing = a; this.form.reset(a); this.showModal = true; }
  closeModal(): void { this.showModal = false; this.editing = null; }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const obs = this.editing
      ? this.agentService.update(this.editing.id!, this.form.value)
      : this.agentService.create(this.form.value);
    obs.subscribe({ next: () => { this.load(); this.closeModal(); this.loading = false; }, error: () => this.loading = false });
  }

  delete(id: number): void {
    if (confirm('Supprimer cet agent ?')) {
      this.agentService.delete(id).subscribe(() => this.load());
    }
  }
}
