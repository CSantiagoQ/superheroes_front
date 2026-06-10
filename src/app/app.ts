import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { NotifyService } from './services/notify.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('superheroes App');
  authService = inject(AuthService);
  private router = inject(Router);
  public notify = inject(NotifyService);
  isLoggedIn = false;

  constructor() {
    if (this.hasLocalStorage()) {
      this.isLoggedIn = !!localStorage.getItem('token');
    }
    this.restoreTheme();
  }

  toggleDark() {
    if (typeof document === 'undefined') return;
    const root = document.documentElement || document.body;
    const isDark = root.classList.toggle('dark-theme');
    try {
      if (this.hasLocalStorage()) localStorage.setItem('darkTheme', String(isDark));
    } catch (e) {}
  }

  restoreTheme() {
    if (!this.hasLocalStorage()) return;
    const val = localStorage.getItem('darkTheme');
    if (val === 'true' && typeof document !== 'undefined') {
      (document.documentElement || document.body).classList.add('dark-theme');
    }
  }

  logout() {
    if (this.hasLocalStorage()) {
      localStorage.removeItem('token');
    }
    this.isLoggedIn = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private hasLocalStorage(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
