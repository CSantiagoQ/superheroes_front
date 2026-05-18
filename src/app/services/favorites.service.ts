import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Heroe } from './heroes.service';

interface ApiMessageResponse {
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private http = inject(HttpClient);
  private apiUrl = '/api';

  getFavorites(): Observable<Heroe[]> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No se encontro el token de autenticacion'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Heroe[]>(`${this.apiUrl}/heroes/favorites`, { headers });
  }

  addFavorite(heroeId: number): Observable<ApiMessageResponse> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No se encontro el token de autenticacion'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<ApiMessageResponse>(`${this.apiUrl}/heroes/favorites`, { heroeId }, { headers });
  }

  removeFavorite(heroeId: number): Observable<ApiMessageResponse> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No se encontro el token de autenticacion'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<ApiMessageResponse>(`${this.apiUrl}/heroes/favorites/${heroeId}`, { headers });
  }

  private getToken(): string | null {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem('token');
  }
}
