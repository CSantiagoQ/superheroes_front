import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  nombre: string;
  user?: unknown;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<{ nombre: string } | null>(null);
  private apiUrl = 'api/auth/login';
  private http = inject(HttpClient);

  constructor() {
    if (!this.hasLocalStorage()) {
      return;
    }

    const token = localStorage.getItem('token');
    const savedName = localStorage.getItem('user_name');
    const savedUser = localStorage.getItem('user');

    if (!token) {
      return;
    }

    if (savedName) {
      this.currentUser.set({ nombre: savedName });
      return;
    }

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as { nombre?: string };
        if (parsedUser && parsedUser.nombre) {
          this.currentUser.set({ nombre: parsedUser.nombre });
        }
      } catch {
        // Ignore invalid stored user data
      }
    }
  }

  setLoginData(nombre: string, token: string) {
    if (!this.hasLocalStorage()) {
      return;
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user_name', nombre);
    this.currentUser.set({ nombre });
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, credentials).pipe(
      tap((res: LoginResponse) => {
        if (res.token && this.hasLocalStorage()) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          if (res.nombre) {
            localStorage.setItem('user_name', res.nombre);
          }
        }
      })
    );
  }

  logout() {
    if (this.hasLocalStorage()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_name');
      localStorage.clear();
    }

    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    if (this.currentUser()) {
      return true;
    }

    if (!this.hasLocalStorage()) {
      return false;
    }

    return !!localStorage.getItem('token');
  }

  private hasLocalStorage(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
