import { Injectable, signal } from '@angular/core';

type CurrentUser = {
  nombre: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<CurrentUser | null>(null);

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('token');
  }
}
