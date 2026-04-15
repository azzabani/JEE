import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Utilisateur {
  id: number;
  username: string;
  nom: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="container-fluid p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-shield-lock me-2"></i>Administration</h2>
        <button class="btn btn-primary" (click)="openModal()">
          <i class="bi bi-person-plus me-2"></i>Créer un utilisateur
        </button>
      </div>

      <!-- Statistiques -->
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <h3 class="mb-0">{{ stats.totalUsers }}</h3>
              <small>Utilisateurs totaux</small>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <h3 class="mb-0">{{ stats.clients }}</h3>
              <small>Clients</small>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body">
              <h3 class="mb-0">{{ stats.agents }}</h3>
              <small>Agents SAV</small>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <h3 class="mb-0">{{ stats.admins }}</h3>
              <small>Administrateurs</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtres -->
      <div class="card mb-3">
        <div class="card-body">
          <div class="row g-2">
            <div class="col-md-4">
              <input type="text" class="form-control" placeholder="Rechercher..." [(ngModel)]="searchTerm">
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="filterRole">
                <option value="">Tous les rôles</option>
                <option value="ROLE_CLIENT">Clients</option>
                <option value="ROLE_AGENT">Agents SAV</option>
                <option value="ROLE_ADMIN">Administrateurs</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Table des utilisateurs -->
      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>#</th>
                  <th>Nom</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of filteredUsers">
                  <td>{{ user.id }}</td>
                  <td>{{ user.nom }}</td>
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="badge" [class.bg-success]="user.role === 'ROLE_CLIENT'"
                          [class.bg-info]="user.role === 'ROLE_AGENT'"
                          [class.bg-warning]="user.role === 'ROLE_ADMIN'">
                      {{ getRoleLabel(user.role) }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger" 
                            (click)="deleteUser(user.id)"
                            [disabled]="user.id === currentUserId">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr *ngIf="filteredUsers.length === 0">
                  <td colspan="6" class="text-center text-muted py-4">Aucun utilisateur trouvé</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal Créer utilisateur -->
      <div class="modal fade show d-block" *ngIf="showModal" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Créer un utilisateur</h5>
              <button type="button" class="btn-close" (click)="closeModal()"></button>
            </div>
            <form [formGroup]="form" (ngSubmit)="createUser()">
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Nom complet *</label>
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
                  <input type="tel" class="form-control" formControlName="telephone" placeholder="Ex: 0612345678">
                  <div *ngIf="f['telephone'].touched && f['telephone'].invalid" class="text-danger small">Téléphone requis</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Nom d'utilisateur *</label>
                  <input type="text" class="form-control" formControlName="username">
                  <div *ngIf="f['username'].touched && f['username'].invalid" class="text-danger small">Username requis</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Mot de passe *</label>
                  <input type="password" class="form-control" formControlName="password">
                  <div *ngIf="f['password'].touched && f['password'].invalid" class="text-danger small">Min. 6 caractères</div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Rôle *</label>
                  <select class="form-select" formControlName="role">
                    <option value="ROLE_CLIENT">Client</option>
                    <option value="ROLE_AGENT">Agent SAV</option>
                    <option value="ROLE_ADMIN">Administrateur</option>
                  </select>
                </div>
                <div *ngIf="error" class="alert alert-danger py-2 small">{{ error }}</div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
                <button type="submit" class="btn btn-primary" [disabled]="loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card { box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .table th { font-weight: 600; }
  `]
})
export class AdminComponent implements OnInit {
  users: Utilisateur[] = [];
  searchTerm = '';
  filterRole = '';
  showModal = false;
  loading = false;
  error = '';
  form: FormGroup;
  currentUserId: number | null = null;

  stats = {
    totalUsers: 0,
    clients: 0,
    agents: 0,
    admins: 0
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{8,15}$/)]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['ROLE_AGENT', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  get filteredUsers() {
    return this.users.filter(u => {
      const matchSearch = !this.searchTerm ||
        u.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchRole = !this.filterRole || u.role === this.filterRole;
      return matchSearch && matchRole;
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      // Extraire l'ID depuis le token ou une autre source
      // Pour l'instant, on ne peut pas supprimer son propre compte
    }
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<Utilisateur[]>(`${environment.apiUrl}/admin/users`).subscribe({
      next: (users) => {
        this.users = users;
        this.calculateStats();
      },
      error: (err) => console.error('Erreur chargement utilisateurs:', err)
    });
  }

  calculateStats(): void {
    this.stats.totalUsers = this.users.length;
    this.stats.clients = this.users.filter(u => u.role === 'ROLE_CLIENT').length;
    this.stats.agents = this.users.filter(u => u.role === 'ROLE_AGENT').length;
    this.stats.admins = this.users.filter(u => u.role === 'ROLE_ADMIN').length;
  }

  openModal(): void {
    this.form.reset({ role: 'ROLE_AGENT' });
    this.error = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  createUser(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.loadUsers();
        this.closeModal();
        this.loading = false;
        alert('Utilisateur créé avec succès !');
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la création';
        this.loading = false;
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.http.delete(`${environment.apiUrl}/admin/users/${id}`).subscribe({
        next: () => {
          this.loadUsers();
          alert('Utilisateur supprimé avec succès');
        },
        error: (err) => alert('Erreur lors de la suppression')
      });
    }
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'ROLE_CLIENT': 'Client',
      'ROLE_AGENT': 'Agent SAV',
      'ROLE_ADMIN': 'Admin'
    };
    return labels[role] || role;
  }
}
