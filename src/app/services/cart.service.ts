import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Heroe } from './heroes.service';

export interface CartItem extends Heroe {
  quantity: number;
}

interface ApiMessageResponse {
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = '/api/cart';

  getCart(): Observable<CartItem[]> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('No se encontro el token de autenticacion'));
    }

    return this.http.get<CartItem[]>(this.apiUrl, { headers });
  }

  addToCart(heroId: number): Observable<ApiMessageResponse> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('No se encontro el token de autenticacion'));
    }

    return this.http.post<ApiMessageResponse>(this.apiUrl, { heroId }, { headers });
  }

  increment(heroId: number): Observable<ApiMessageResponse> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('No se encontro el token de autenticacion'));
    }

    return this.http.put<ApiMessageResponse>(`${this.apiUrl}/${heroId}/increment`, {}, { headers });
  }

  decrement(heroId: number): Observable<ApiMessageResponse> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('No se encontro el token de autenticacion'));
    }

    return this.http.put<ApiMessageResponse>(`${this.apiUrl}/${heroId}/decrement`, {}, { headers });
  }

  remove(heroId: number): Observable<ApiMessageResponse> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('No se encontro el token de autenticacion'));
    }

    return this.http.delete<ApiMessageResponse>(`${this.apiUrl}/${heroId}`, { headers });
  }

  private getAuthHeaders(): HttpHeaders | null {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return null;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
