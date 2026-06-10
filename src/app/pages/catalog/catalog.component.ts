// src/app/pages/catalog/catalog.component.ts
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
//Servicios
import { HeroesService, Heroe } from '../../services/heroes.service';
import { AuthService } from '../../services/auth.service';
import { NotifyService } from '../../services/notify.service';
import { FavoritesService } from '../../services/favorites.service';
import { CartService } from '../../services/cart.service';
@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule], // Puede quedar vacío si no usas pipes como | date o | json
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotifyService);
  private favService = inject(FavoritesService);
  private cartService = inject(CartService);
  private heroesService = inject(HeroesService);
  private cdr = inject(ChangeDetectorRef);
  heroes: Heroe[] = [];
  loading: boolean = true;
  ngOnInit(): void {
    this.loadHeroes();
  }
  loadHeroes() {
    this.loading = true;
    this.heroesService.getCatalog().subscribe({
      next: (data: Heroe[]) => {
        this.heroes = data;
        if (this.authService.isLoggedIn()) {
          this.markFavoriteHeroes();
          return;
        }

        this.loading = false;
        this.cdr.detectChanges();
        // console.log('Catálogo renderizado con @for:', this.heroes);
      },
      error: (err: unknown) => {
        console.error('Error:', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
  private markFavoriteHeroes() {
    this.favService.getFavorites().subscribe({
      next: (favorites) => {
        const favoriteIds = new Set(
          favorites.map((favorite) => favorite.id).filter((id): id is number => id != null)
        );

        this.heroes = this.heroes.map((heroe) => ({
          ...heroe,
          esFavorito: heroe.id != null && favoriteIds.has(heroe.id),
        }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
  toggleFavorite(heroe: Heroe) {
    if (heroe.id == null) {
      this.notify.show('No se pudo identificar el h�roe seleccionado', 'error');
      return;
    }

    if (heroe.esFavorito) {
      // Si ya es favorito, lo eliminamos
      this.favService.removeFavorite(heroe.id).subscribe({
        next: () => {
          heroe.esFavorito = false;
          this.notify.show('Eliminado de favoritos', 'info');
          this.cdr.detectChanges();
        },
      });
    } else {
      // Si no es favorito, lo agregamos (tu lógica anterior)
      this.favService.addFavorite(heroe.id).subscribe({
        next: () => {
          heroe.esFavorito = true;
          this.notify.show('¡Añadido! ❤️', 'success');
          this.cdr.detectChanges();
        },
      });
    }
  }
  addToFavorites(heroes: Heroe) {
    // 1. Validamos si está logueado
    if (!this.authService.isLoggedIn()) {
      this.notify.show('¡ALTO AHÍ! Inicia sesión primero 🔒', 'info');
      return;
    }
    if (heroes.id == null) {
      this.notify.show('No se pudo identificar el h�roe seleccionado', 'error');
      return;
    }

    console.log('Añadiendo a favoritos el héroe con ID:', heroes.id);
    // 2. Si está logueado, procedemos con la petición
    this.heroesService.addFavorite(heroes.id).subscribe({
      next: () => {
        // 1. Buscamos el índice del héroe en nuestro array principal
        const index = this.heroes.findIndex((h) => h.id === heroes.id);
        if (index !== -1) {
          // 2. Creamos una copia del objeto y le añadimos/cambiamos la propiedad
          // Esto rompe la referencia antigua y obliga a Angular a redibujar
          this.heroes[index] = {
            ...this.heroes[index],
            esFavorito: true,
          };
        }
        this.notify.show(`${heroes.nombre} añadido a tus favoritos ❤️`, 'success');

        heroes.esFavorito = true;
        this.cdr.detectChanges(); //esto hace que angular se de cuenta del cambio
      },
      error: (err: { status?: number }) => {
        if (err.status === 401) {
          this.notify.show('Tu sesión ha expirado. Por favor, inicia sesión de nuevo 🔒', 'error');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (err.status === 400) {
          this.notify.show(`${heroes.nombre} ya está en tus favoritos ❗`, 'info');
        } else {
          this.notify.show('Error al añadir a favoritos ❌', 'error');
          console.error('Error al añadir a favoritos:', err);
        }
      },
    });
  }

  addToCart(heroe: Heroe) {
    if (!this.authService.isLoggedIn()) {
      this.notify.show('Inicia sesion primero para agregar al carrito', 'info');
      return;
    }
    if (heroe.id == null) {
      this.notify.show('No se pudo identificar el heroe seleccionado', 'error');
      return;
    }

    this.cartService.addToCart(heroe.id).subscribe({
      next: () => {
        this.notify.show(`${heroe.nombre} agregado al carrito`, 'success');
      },
      error: (err: { status?: number }) => {
        if (err.status === 401) {
          this.notify.show('Tu sesion ha expirado. Por favor, inicia sesion de nuevo', 'error');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.notify.show('Error al agregar al carrito', 'error');
        }
      },
    });
  }
}
