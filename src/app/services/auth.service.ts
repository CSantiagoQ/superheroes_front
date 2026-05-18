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

    const savedUser = localStorage.getItem('user_name');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      this.currentUser.set({ nombre: savedUser });
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
        }
      })
    );
  }

  logout() {
    if (this.hasLocalStorage()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.clear();
    }

    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  private hasLocalStorage(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}
