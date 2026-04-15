import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent],
  template: `
    <div class="d-flex">
      <app-sidebar *ngIf="authService.isLoggedIn()"></app-sidebar>
      <div [class]="authService.isLoggedIn() ? 'main-content flex-grow-1' : 'flex-grow-1'">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
