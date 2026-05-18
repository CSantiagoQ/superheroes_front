import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// Define un tipo de interfaz para la respuesta
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

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  // Usamos /api y el proxy se encarga de redirigir a http://localhost:3000/api
  private readonly API_URL = '/api';
  constructor(private http: HttpClient) {}
  getCatalog(): Observable<Heroe[]> {
    console.log('Llamando a getCatalog');
    console.log(`URL de la API: ${this.API_URL}/catalog`);
    return this.http.get<Heroe[]>(`${this.API_URL}/heroes/catalog`);
  }
  addFavorite(heroId: number): Observable<any> {
    // 1. Obtener el token del localStorage, esto se agrega después del login
    const token = localStorage.getItem('token');
    if (!token || token === '') {
      throw new Error('No se encontró el token de autenticación');
    }
    // 2. Crear las cabeceras con el formato 'Authorization: Bearer TOKEN'
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`${this.API_URL}/heroes/favorites`, { heroId }, { headers });
  }
  createHero(hero: {
    nombre: string;
    poder: string;
    fortaleza: string;
    resistencia: string;
    debilidad: string;
    imagen_url: string;
  }): Observable<any> {
    if (
      !hero.nombre ||
      !hero.poder ||
      !hero.fortaleza ||
      !hero.resistencia ||
      !hero.debilidad ||
      !hero.imagen_url
    ) {
      throw new Error('Todos los campos del héroe son obligatorios');
    }
    // 1. Obtener el token del localStorage, esto se agrega después del login
    const token = localStorage.getItem('token');
    if (!token || token === '') {
      throw new Error('No se encontró el token de autenticación');
    }
    // 2. Crear las cabeceras con el formato 'Authorization: Bearer TOKEN'
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`${this.API_URL}/heroes`, hero, { headers });
  }
}
