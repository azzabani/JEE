import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClientService } from '../../core/services/client.service';
import { Client } from '../../core/models';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="navbar-top d-flex justify-content-between align-items-center">
      <h5 class="mb-0 fw-bold"><i class="bi bi-people me-2 text-primary"></i>Gestion des Clients</h5>
      <button class="btn btn-primary btn-sm" (click)="openModal()">
        <i class="bi bi-plus-lg me-1"></i>Nouveau client
      </button>
    </div>

    <div class="card">
      <div class="card-body p-0">
        <div class="p-3">
          <input type="text" class="form-control" placeholder="Rechercher un client..." [(ngModel)]="search" [ngModelOptions]="{standalone: true}">
        </div>
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>#</th><th>Nom</th><th>Email</th><th>Téléphone</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of filtered">
                <td>{{ c.id }}</td>
                <td><i class="bi bi-person-circle me-2 text-muted"></i>{{ c.nom }}</td>
                <td>{{ c.email }}</td>
                <td>{{ c.telephone }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-1" (click)="edit(c)"><i class="bi bi-pencil"></i></button>
                  <button class="btn btn-sm btn-outline-danger" (click)="delete(c.id!)"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
              <tr *ngIf="filtered.length === 0">
                <td colspan="5" class="text-center text-muted py-4">Aucun client trouvé</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade show d-block" *ngIf="showModal" style="background:rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editing ? 'Modifier' : 'Nouveau' }} client</h5>
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
                <label class="form-label">Email *</label>
                <input type="email" class="form-control" formControlName="email">
                <div *ngIf="f['email'].touched && f['email'].invalid" class="text-danger small">Email valide requis</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Téléphone *</label>
                <input type="text" class="form-control" formControlName="telephone">
                <div *ngIf="f['telephone'].touched && f['telephone'].invalid" class="text-danger small">Téléphone requis</div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="submit" class="btn btn-primary" [disabled]="loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  search = '';
  showModal = false;
  editing: Client | null = null;
  form: FormGroup;
  loading = false;

  constructor(private clientService: ClientService, private fb: FormBuilder) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }
  get filtered() {
    return this.clients.filter(c =>
      c.nom.toLowerCase().includes(this.search.toLowerCase()) ||
      c.email.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.clientService.getAll().subscribe(data => this.clients = data);
  }

  openModal(client?: Client): void {
    this.editing = client || null;
    this.form.reset(client || {});
    this.showModal = true;
  }

  edit(c: Client): void { this.openModal(c); }
  closeModal(): void { this.showModal = false; this.editing = null; }

  save(): void {
    if (this.form.invalid) { 
      this.form.markAllAsTouched(); 
      return; 
    }
    this.loading = true;
    const obs = this.editing
      ? this.clientService.update(this.editing.id!, this.form.value)
      : this.clientService.create(this.form.value);
    obs.subscribe({ 
      next: () => { 
        alert(this.editing ? 'Client modifié avec succès' : 'Client créé avec succès');
        this.load(); 
        this.closeModal(); 
        this.loading = false; 
      }, 
      error: (err) => {
        console.error('Erreur:', err);
        alert('Erreur: ' + (err.error?.message || 'Impossible de sauvegarder le client'));
        this.loading = false;
      }
    });
  }

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.delete(id).subscribe({
        next: () => {
          alert('Client supprimé avec succès');
          this.load();
        },
        error: (err) => {
          console.error('Erreur:', err);
          alert('Erreur: ' + (err.error?.message || 'Impossible de supprimer le client'));
        }
      });
    }
  }
}
