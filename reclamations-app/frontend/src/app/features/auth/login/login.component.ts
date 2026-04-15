import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="text-center mb-4">
          <i class="bi bi-shield-check text-primary" style="font-size:3rem"></i>
          <h4 class="mt-2 fw-bold">Connexion</h4>
          <p class="text-muted small">Système de gestion des réclamations</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label fw-semibold">Nom d'utilisateur</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-person"></i></span>
              <input type="text" class="form-control" formControlName="username" placeholder="Votre identifiant">
            </div>
            <div *ngIf="f['username'].touched && f['username'].invalid" class="text-danger small mt-1">
              Nom d'utilisateur requis
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold">Mot de passe</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-lock"></i></span>
              <input [type]="showPwd ? 'text' : 'password'" class="form-control" formControlName="password" placeholder="Votre mot de passe">
              <button type="button" class="btn btn-outline-secondary" (click)="showPwd = !showPwd">
                <i [class]="showPwd ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <div *ngIf="f['password'].touched && f['password'].invalid" class="text-danger small mt-1">
              Mot de passe requis
            </div>
          </div>

          <div *ngIf="error" class="alert alert-danger py-2 small">{{ error }}</div>

          <button type="submit" class="btn btn-primary w-100 py-2" [disabled]="loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            Se connecter
          </button>
        </form>

        <hr>
        <p class="text-center text-muted small mb-0">
          Pas encore de compte ? <a routerLink="/register" class="text-primary">S'inscrire</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';
  showPwd = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    this.authService.login(this.form.value).subscribe({
      next: (response) => {
        // Rediriger selon le rôle
        if (response.role === 'ROLE_CLIENT') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/reclamations']);
        }
      },
      error: () => { this.error = 'Identifiants invalides'; this.loading = false; }
    });
  }
}
