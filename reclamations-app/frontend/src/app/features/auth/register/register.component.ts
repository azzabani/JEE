import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="text-center mb-4">
          <i class="bi bi-person-plus text-primary" style="font-size:3rem"></i>
          <h4 class="mt-2 fw-bold">Inscription</h4>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label fw-semibold">Nom complet</label>
              <input type="text" class="form-control" formControlName="nom" placeholder="Votre nom">
              <div *ngIf="f['nom'].touched && f['nom'].invalid" class="text-danger small mt-1">Nom requis</div>
            </div>
            <div class="col-12">
              <label class="form-label fw-semibold">Email</label>
              <input type="email" class="form-control" formControlName="email" placeholder="email@exemple.com">
              <div *ngIf="f['email'].touched && f['email'].invalid" class="text-danger small mt-1">Email valide requis</div>
            </div>
            <div class="col-12">
              <label class="form-label fw-semibold">Téléphone</label>
              <input type="tel" class="form-control" formControlName="telephone" placeholder="Ex: 0612345678">
              <div *ngIf="f['telephone'].touched && f['telephone'].invalid" class="text-danger small mt-1">
                <span *ngIf="f['telephone'].errors?.['required']">Téléphone requis</span>
                <span *ngIf="f['telephone'].errors?.['pattern']">Format invalide (8-15 chiffres)</span>
              </div>
            </div>
            <div class="col-12">
              <label class="form-label fw-semibold">Nom d'utilisateur</label>
              <input type="text" class="form-control" formControlName="username" placeholder="Identifiant unique">
              <div *ngIf="f['username'].touched && f['username'].invalid" class="text-danger small mt-1">Identifiant requis</div>
            </div>
            <div class="col-12">
              <label class="form-label fw-semibold">Mot de passe</label>
              <input type="password" class="form-control" formControlName="password" placeholder="Min. 6 caractères">
              <div *ngIf="f['password'].touched && f['password'].invalid" class="text-danger small mt-1">Min. 6 caractères</div>
            </div>
            <div class="col-12">
              <label class="form-label fw-semibold">Rôle</label>
              <select class="form-select" formControlName="role">
                <option value="ROLE_CLIENT">Client</option>
              </select>
              <div class="form-text small">Inscription en tant que client</div>
            </div>
          </div>

          <div *ngIf="error" class="alert alert-danger py-2 small mt-3">{{ error }}</div>

          <button type="submit" class="btn btn-primary w-100 py-2 mt-3" [disabled]="loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            Créer mon compte
          </button>
        </form>

        <hr>
        <p class="text-center text-muted small mb-0">
          Déjà un compte ? <a routerLink="/login" class="text-primary">Se connecter</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{8,15}$/)]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['ROLE_CLIENT', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    this.authService.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/reclamations']),
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de l\'inscription';
        this.loading = false;
      }
    });
  }
}
