import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../core/services/client.service';
import { ReclamationService } from '../../core/services/reclamation.service';
import { AuthService } from '../../core/services/auth.service';
import { Client } from '../../core/models';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <div class="header">
        <h1>Mon Profil</h1>
      </div>

      <div class="profile-grid">
        <!-- Informations du compte -->
        <div class="profile-card">
          <div class="card-header">
            <h2>Informations du compte</h2>
            <button class="btn-edit" *ngIf="!editMode" (click)="enableEdit()">
              ✏️ Modifier
            </button>
          </div>

          <form class="profile-form" *ngIf="client" (ngSubmit)="saveProfile()">
            <div class="form-group">
              <label for="nom">Nom complet *</label>
              <input 
                type="text" 
                id="nom" 
                [(ngModel)]="client.nom" 
                name="nom"
                [disabled]="!editMode"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input 
                type="email" 
                id="email" 
                [(ngModel)]="client.email" 
                name="email"
                [disabled]="!editMode"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="telephone">Téléphone *</label>
              <input 
                type="tel" 
                id="telephone" 
                [(ngModel)]="client.telephone" 
                name="telephone"
                [disabled]="!editMode"
                required
                class="form-input"
              />
            </div>

            <div class="form-actions" *ngIf="editMode">
              <button type="button" class="btn-secondary" (click)="cancelEdit()">
                Annuler
              </button>
              <button type="submit" class="btn-primary">
                💾 Enregistrer
              </button>
            </div>
          </form>

          <div class="loading-state" *ngIf="!client">
            <div class="spinner"></div>
            <p>Chargement...</p>
          </div>
        </div>

        <!-- Statistiques du compte -->
        <div class="stats-card">
          <h2>Mes statistiques</h2>
          
          <div class="stat-item">
            <div class="stat-icon">📋</div>
            <div class="stat-content">
              <h3>{{ stats.totalReclamations }}</h3>
              <p>Réclamations créées</p>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <h3>{{ stats.reclamationsResolues }}</h3>
              <p>Réclamations résolues</p>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon">⏳</div>
            <div class="stat-content">
              <h3>{{ stats.reclamationsEnCours }}</h3>
              <p>En cours de traitement</p>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <h3>{{ stats.noteMoyenne }}/5</h3>
              <p>Satisfaction moyenne</p>
            </div>
          </div>
        </div>

        <!-- Informations du compte utilisateur -->
        <div class="account-card">
          <h2>Informations de connexion</h2>
          
          <div class="account-info">
            <div class="info-row">
              <span class="info-label">Nom d'utilisateur</span>
              <span class="info-value">{{ username }}</span>
            </div>

            <div class="info-row">
              <span class="info-label">Rôle</span>
              <span class="info-value">
                <span class="role-badge">👤 Client</span>
              </span>
            </div>

            <div class="info-row">
              <span class="info-label">Membre depuis</span>
              <span class="info-value">{{ memberSince }}</span>
            </div>
          </div>

          <div class="account-actions">
            <button class="btn-danger" (click)="logout()">
              🚪 Se déconnecter
            </button>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="actions-card">
          <h2>Actions rapides</h2>
          
          <div class="quick-actions">
            <button class="action-button" (click)="goToDashboard()">
              <span class="action-icon">🏠</span>
              <span class="action-text">Tableau de bord</span>
            </button>

            <button class="action-button" (click)="goToReclamations()">
              <span class="action-icon">📝</span>
              <span class="action-text">Mes réclamations</span>
            </button>

            <button class="action-button" (click)="createReclamation()">
              <span class="action-icon">➕</span>
              <span class="action-text">Nouvelle réclamation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 2rem;
    }

    .header h1 {
      margin: 0;
      color: #1a1a2e;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }

    .profile-card, .stats-card, .account-card, .actions-card {
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

    .profile-card h2, .stats-card h2, .account-card h2, .actions-card h2 {
      margin-top: 0;
      margin-bottom: 1.5rem;
      color: #1a1a2e;
    }

    .btn-edit {
      background: #3498db;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background 0.2s;
    }

    .btn-edit:hover {
      background: #2980b9;
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: #666;
      font-size: 0.9rem;
    }

    .form-input {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #3498db;
    }

    .form-input:disabled {
      background: #f8f9fa;
      cursor: not-allowed;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    .btn-primary, .btn-secondary, .btn-danger {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover {
      background: #2980b9;
    }

    .btn-secondary {
      background: #f8f9fa;
      color: #666;
      border: 1px solid #ddd;
    }

    .btn-secondary:hover {
      background: #e9ecef;
    }

    .btn-danger {
      background: #e74c3c;
      color: white;
      width: 100%;
    }

    .btn-danger:hover {
      background: #c0392b;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-content h3 {
      margin: 0;
      font-size: 1.5rem;
      color: #1a1a2e;
    }

    .stat-content p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .account-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .info-label {
      font-weight: 600;
      color: #666;
    }

    .info-value {
      color: #1a1a2e;
    }

    .role-badge {
      background: #e3f2fd;
      color: #1976d2;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.9rem;
    }

    .account-actions {
      margin-top: 1.5rem;
    }

    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .action-button {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
    }

    .action-button:hover {
      background: #3498db;
      border-color: #3498db;
      color: white;
      transform: translateX(4px);
    }

    .action-icon {
      font-size: 1.5rem;
    }

    .action-text {
      font-size: 1rem;
      font-weight: 500;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      color: #666;
    }

    .spinner {
      width: 40px;
      height: 40px;
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
      .profile-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ClientProfileComponent implements OnInit {
  client: Client | null = null;
  originalClient: Client | null = null;
  editMode = false;
  username = '';
  memberSince = '';
  
  stats = {
    totalReclamations: 0,
    reclamationsResolues: 0,
    reclamationsEnCours: 0,
    noteMoyenne: 0
  };

  constructor(
    private clientService: ClientService,
    private reclamationService: ReclamationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.username = user.username;
      this.memberSince = 'Janvier 2024'; // À adapter selon vos besoins
      this.loadClientProfile();
      this.loadStats();
    }
  }

  loadClientProfile(): void {
    // Charger le profil du client
    const user = this.authService.currentUser;
    if (user) {
      // D'abord, vérifier si on a un ID de client stocké dans localStorage
      const storedClientId = localStorage.getItem('clientId');
      
      if (storedClientId) {
        // Charger directement par ID
        this.clientService.getById(+storedClientId).subscribe({
          next: (foundClient) => {
            this.client = { ...foundClient };
            this.originalClient = { ...foundClient };
          },
          error: (err) => {
            console.error('Erreur chargement profil par ID:', err);
            // Si l'ID n'est plus valide, chercher par nom
            this.loadClientByName(user);
          }
        });
      } else {
        // Chercher par nom
        this.loadClientByName(user);
      }
    }
  }

  private loadClientByName(user: any): void {
    // Utiliser l'email de l'utilisateur pour trouver le client
    this.clientService.getByEmail(user.email).subscribe({
      next: (foundClient) => {
        console.log('Client trouvé par email:', foundClient);
        this.client = { ...foundClient };
        this.originalClient = { ...foundClient };
        
        // Stocker l'ID pour les prochaines fois
        if (foundClient.id) {
          localStorage.setItem('clientId', foundClient.id.toString());
        }
        
        this.loadStats();
      },
      error: (err) => {
        console.error('Erreur chargement profil:', err);
        // Créer un profil par défaut si le client n'existe pas
        this.client = {
          nom: user.nom,
          email: user.email,
          telephone: ''
        };
        this.originalClient = { ...this.client };
      }
    });
  }

  loadStats(): void {
    // Charger les vraies statistiques du client
    const user = this.authService.currentUser;
    if (user) {
      this.reclamationService.getAll().subscribe({
        next: (reclamations) => {
          // Filtrer les réclamations du client connecté
          const myReclamations = reclamations.filter(r => 
            r.clientNom === user.nom
          );
          
          this.stats.totalReclamations = myReclamations.length;
          this.stats.reclamationsResolues = myReclamations.filter(r => 
            r.statut === 'RESOLUE' || r.statut === 'FERMEE'
          ).length;
          this.stats.reclamationsEnCours = myReclamations.filter(r => 
            r.statut === 'OUVERTE' || r.statut === 'EN_COURS'
          ).length;
          
          const notedReclamations = myReclamations.filter(r => r.note);
          this.stats.noteMoyenne = notedReclamations.length > 0
            ? Math.round(notedReclamations.reduce((sum, r) => sum + (r.note || 0), 0) / notedReclamations.length * 10) / 10
            : 0;
        },
        error: (err) => {
          console.error('Erreur chargement statistiques:', err);
          // Garder les stats à 0 en cas d'erreur
        }
      });
    }
  }

  enableEdit(): void {
    this.editMode = true;
  }

  cancelEdit(): void {
    this.editMode = false;
    if (this.originalClient) {
      this.client = { ...this.originalClient };
    }
  }

  saveProfile(): void {
    if (!this.client) return;

    console.log('Sauvegarde du profil:', this.client);

    if (this.client.id) {
      // Mise à jour d'un client existant
      console.log('Mise à jour du client ID:', this.client.id);
      this.clientService.update(this.client.id, this.client).subscribe({
        next: (updated) => {
          console.log('Client mis à jour:', updated);
          this.client = updated;
          this.originalClient = { ...updated };
          this.editMode = false;
          // Stocker l'ID pour les prochaines fois
          if (updated.id) {
            localStorage.setItem('clientId', updated.id.toString());
          }
          alert('Profil mis à jour avec succès !');
        },
        error: (err) => {
          console.error('Erreur mise à jour profil:', err);
          console.error('Détails erreur:', err.error);
          alert('Erreur lors de la mise à jour du profil: ' + (err.error?.message || err.message));
        }
      });
    } else {
      // Pas d'ID : vérifier si le client existe déjà par email avant de créer
      console.log('Pas d\'ID, vérification si le client existe par email:', this.client.email);
      
      this.clientService.getByEmail(this.client.email).subscribe({
        next: (existingClient) => {
          // Le client existe déjà, faire une mise à jour
          console.log('Client existant trouvé, mise à jour:', existingClient);
          if (existingClient.id) {
            this.clientService.update(existingClient.id, this.client!).subscribe({
              next: (updated) => {
                console.log('Client mis à jour:', updated);
                this.client = updated;
                this.originalClient = { ...updated };
                this.editMode = false;
                if (updated.id) {
                  localStorage.setItem('clientId', updated.id.toString());
                }
                alert('Profil mis à jour avec succès !');
              },
              error: (err) => {
                console.error('Erreur mise à jour profil:', err);
                alert('Erreur lors de la mise à jour du profil: ' + (err.error?.message || err.message));
              }
            });
          }
        },
        error: (err) => {
          // Le client n'existe pas (404), créer un nouveau
          if (err.status === 404) {
            console.log('Client non trouvé, création d\'un nouveau client');
            this.clientService.create(this.client!).subscribe({
              next: (created) => {
                console.log('Client créé:', created);
                this.client = created;
                this.originalClient = { ...created };
                this.editMode = false;
                if (created.id) {
                  localStorage.setItem('clientId', created.id.toString());
                }
                alert('Profil créé avec succès !');
              },
              error: (err) => {
                console.error('Erreur création profil:', err);
                console.error('Détails erreur:', err.error);
                alert('Erreur lors de la création du profil: ' + (err.error?.message || err.message));
              }
            });
          } else {
            console.error('Erreur vérification client:', err);
            alert('Erreur lors de la vérification du profil');
          }
        }
      });
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToReclamations(): void {
    this.router.navigate(['/mes-reclamations']);
  }

  createReclamation(): void {
    this.router.navigate(['/reclamation/nouvelle']);
  }

  logout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.authService.logout();
    }
  }
}
