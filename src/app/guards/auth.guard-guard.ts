import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    const hasBrowserStorage =
      typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

    if (!hasBrowserStorage) {
      // En SSR no podemos validar el token desde localStorage, así que dejamos que
      // el cliente complete la navegación y valide después.
      return true;
    }

    if (this.authService.isLoggedIn()) {
      return true; // Deja pasar al usuario
    }

    this.router.navigate(['/login']);
    return false;
  }
}
