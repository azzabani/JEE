import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReclamationService } from '../../core/services/reclamation.service';
import { ClientService } from '../../core/services/client.service';
import { AuthService } from '../../core/services/auth.service';
import { Reclamation } from '../../core/models';

@Component({
  selector: 'app-nouvelle-reclamation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-container">
      <div class="header">
        <button class="btn-back" (click)="goBack()">← Retour</button>
        <h1>Nouvelle Réclamation</h1>
      </div>

      <div class="form-card">
        <form (ngSubmit)="submitReclamation()" #reclamationForm="ngForm">
          <div class="form-group">
            <label for="produit">Produit concerné *</label>
            <input 
              type="text" 
              id="produit" 
              name="produit"
              [(ngModel)]="reclamation.produit"
              required
              placeholder="Ex: Ordinateur portable, Service client..."
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="description">Description du problème *</label>
            <textarea 
              id="description" 
              name="description"
              [(ngModel)]="reclamation.description"
              required
              rows="6"
              placeholder="Décrivez en détail votre réclamation..."
              class="form-textarea"
            ></textarea>
            <span class="helper-text">Soyez aussi précis que possible pour faciliter le traitement</span>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="goBack()">
              Annuler
            </button>
            <button 
              type="submit" 
              class="btn-primary" 
              [disabled]="!reclamationForm.valid || isSubmitting"
            >
              {{ isSubmitting ? 'Envoi en cours...' : '📤 Soumettre la réclamation' }}
            </button>
          </div>
        </form>
      </div>

      <div class="info-card">
        <h3>💡 Conseils pour une réclamation efficace</h3>
        <ul>
          <li>Soyez précis sur le produit ou service concerné</li>
          <li>Décrivez clairement le problème rencontré</li>
          <li>Mentionnez la date d'achat ou de survenue du problème si pertinent</li>
          <li>Indiquez ce que vous attendez comme solution</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 2rem;
      max-width: 800px;
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

    .form-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 0.5rem;
    }

    .form-input, .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.2s;
    }

    .form-input:focus, .form-textarea:focus {
      outline: none;
      border-color: #3498db;
    }

    .form-textarea {
      resize: vertical;
      min-height: 120px;
    }

    .helper-text {
      display: block;
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: #666;
      font-style: italic;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn-primary, .btn-secondary {
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

    .btn-primary:hover:not(:disabled) {
      background: #2980b9;
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f8f9fa;
      color: #666;
      border: 1px solid #ddd;
    }

    .btn-secondary:hover {
      background: #e9ecef;
    }

    .info-card {
      background: #e8f5e9;
      border-left: 4px solid #27ae60;
      border-radius: 8px;
      padding: 1.5rem;
    }

    .info-card h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #1a1a2e;
    }

    .info-card ul {
      margin: 0;
      padding-left: 1.5rem;
    }

    .info-card li {
      margin-bottom: 0.5rem;
      color: #666;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .form-actions {
        flex-direction: column;
      }

      .btn-primary, .btn-secondary {
        width: 100%;
      }
    }
  `]
})
export class NouvelleReclamationComponent implements OnInit {
  reclamation: Partial<Reclamation> = {
    produit: '',
    description: ''
  };
  isSubmitting = false;
  clientId: number | null = null;

  constructor(
    private reclamationService: ReclamationService,
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user && user.email) {
      // Récupérer le client par email
      this.clientService.getByEmail(user.email).subscribe({
        next: (client) => {
          if (client && client.id) {
            this.clientId = client.id;
            console.log('Client trouvé, ID:', this.clientId);
          }
        },
        error: (err) => {
          console.error('Erreur chargement client:', err);
          // Si le client n'existe pas (404), le créer automatiquement
          if (err.status === 404) {
            console.log('Client non trouvé, création automatique...');
            this.createClientProfile(user);
          }
        }
      });
    }
  }

  private createClientProfile(user: any): void {
    const newClient = {
      nom: user.nom,
      email: user.email,
      telephone: '0000000000' // Téléphone par défaut
    };

    this.clientService.create(newClient).subscribe({
      next: (created) => {
        console.log('Profil client créé automatiquement:', created);
        if (created.id) {
          this.clientId = created.id;
          alert('Votre profil client a été créé. Vous pouvez maintenant soumettre votre réclamation.');
        }
      },
      error: (err) => {
        console.error('Erreur création profil client:', err);
        alert('Impossible de créer votre profil. Veuillez aller sur "Mon profil" pour le créer manuellement.');
      }
    });
  }

  submitReclamation(): void {
    if (!this.clientId) {
      alert('Erreur: Client non identifié. Veuillez vous reconnecter.');
      return;
    }

    this.isSubmitting = true;

    const newReclamation: Reclamation = {
      clientId: this.clientId,
      produit: this.reclamation.produit!,
      description: this.reclamation.description!
    };

    this.reclamationService.create(newReclamation).subscribe({
      next: (created) => {
        alert('Réclamation créée avec succès !');
        this.router.navigate(['/reclamation', created.id]);
      },
      error: (err) => {
        console.error('Erreur création réclamation:', err);
        alert('Erreur lors de la création de la réclamation');
        this.isSubmitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/mes-reclamations']);
  }
}
