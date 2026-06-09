import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface Heroe {
  id?: number;
  nombre: string;
  poder: string;
  fortaleza: string;
  resistencia: string;
  debilidad: string;
  imagen_url: string;
  esFavorito?: boolean;
}

interface ApiMessageResponse {
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private readonly API_URL = '/api';
  private http = inject(HttpClient);

  getCatalog(): Observable<Heroe[]> {
    return this.http.get<Heroe[]>(`${this.API_URL}/heroes/catalog`);
  }

  addFavorite(heroId: number): Observable<ApiMessageResponse> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No se encontro el token de autenticacion'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<ApiMessageResponse>(
      `${this.API_URL}/heroes/favorites`,
      { heroId },
      { headers }
    );
  }

  createHero(hero: {
    nombre: string;
    poder: string;
    fortaleza: string;
    resistencia: string;
    debilidad: string;
    imagen_url: string;
  }): Observable<Heroe> {
    if (
      !hero.nombre ||
      !hero.poder ||
      !hero.fortaleza ||
      !hero.resistencia ||
      !hero.debilidad ||
      !hero.imagen_url
    ) {
      return throwError(() => new Error('Todos los campos del heroe son obligatorios'));
    }

    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No se encontro el token de autenticacion'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Heroe>(`${this.API_URL}/heroes`, hero, { headers });
  }

  private getToken(): string | null {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem('token');
  }
}
