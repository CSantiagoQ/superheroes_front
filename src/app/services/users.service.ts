import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterUserRequest {
  nombre: string;
  email: string;
  password: string;
  role: string;
}

interface RegisterUserResponse {
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private apiUrl = 'api/auth/register'; // El proxy lo redirigirá a tu backend
  private http = inject(HttpClient);

  registerUser(userData: RegisterUserRequest): Observable<RegisterUserResponse> {
    return this.http.post<RegisterUserResponse>(this.apiUrl, userData);
  }
}
