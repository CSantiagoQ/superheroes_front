import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Heroe } from './heroes.service';

interface ApiMessageResponse {
  message?: string;
}
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private http = inject(HttpClient);
  private apiUrl = '/api';
  // Obtener todos los favoritos del usuario actual
  getFavorites(): Observable<Heroe[]> {
    // 1. Obtener el token del localStorage, esto se agrega después del login
    const token = localStorage.getItem('token');
    if (!token || token === '') {
      throw new Error('No se encontró el token de autenticación');
    }
    // 2. Crear las cabeceras con el formato 'Authorization: Bearer TOKEN'
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    console.log('Obteniendo favoritos con token:', token);
    return this.http.get<Heroe[]>(`${this.apiUrl}/heroes/favorites`, { headers });
  }
  // Agregar a favoritos
  addFavorite(heroeId: number): Observable<ApiMessageResponse> {
    // 1. Obtener el token del localStorage, esto se agrega después del login
    const token = localStorage.getItem('token');
    if (!token || token === '') {
      throw new Error('No se encontró el token de autenticación');
    }
    // 2. Crear las cabeceras con el formato 'Authorization: Bearer TOKEN'
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`${this.apiUrl}/heroes/favorites`, { heroeId }, { headers });
  }
  // Eliminar de favoritos
  removeFavorite(heroeId: number): Observable<ApiMessageResponse> {
    // 1. Obtener el token del localStorage, esto se agrega después del login
    const token = localStorage.getItem('token');
    if (!token || token === '') {
      throw new Error('No se encontró el token de autenticación');
    }
    // 2. Crear las cabeceras con el formato 'Authorization: Bearer TOKEN'
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(`${this.apiUrl}/heroes/favorites/${heroeId}`, { headers });
  }
}
