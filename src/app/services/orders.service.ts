import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface OrderItem {
  id: number;
  order_id: number;
  superheroe_id: number;
  quantity: number;
  precio: string | number;
  nombre: string;
  poder: string;
  imagen_url: string;
}

export interface Order {
  id: number;
  user_id: number;
  status: 'en_camino' | 'entregado';
  total: string | number;
  created_at: string;
  items: OrderItem[];
}

interface CheckoutResponse {
  message?: string;
  order: Order;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private http = inject(HttpClient);
  private apiUrl = '/api/orders';

  checkout(): Observable<CheckoutResponse> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('No se encontro el token de autenticacion'));
    }

    return this.http.post<CheckoutResponse>(`${this.apiUrl}/checkout`, {}, { headers });
  }

  getOrders(): Observable<Order[]> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('No se encontro el token de autenticacion'));
    }

    return this.http.get<Order[]>(this.apiUrl, { headers });
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
