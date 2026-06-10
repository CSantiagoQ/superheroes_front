import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroesService, Heroe } from '../../services/heroes.service';
import { FavoritesService } from '../../services/favorites.service';
import { CartService } from '../../services/cart.service';
import { NotifyService } from '../../services/notify.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss'],
})
export class HeroDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private heroesService = inject(HeroesService);
  private favService = inject(FavoritesService);
  private cartService = inject(CartService);
  private notify = inject(NotifyService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  hero: Heroe | null = null;
  loading = true;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;
    if (!id) {
      this.notify.show('ID de héroe inválido', 'error');
      this.router.navigate(['/']);
      return;
    }

    this.heroesService.getHeroDetail(id).subscribe({
      next: (data) => {
        this.hero = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.notify.show('No se pudo cargar el héroe', 'error');
        this.router.navigate(['/catalog']);
      },
    });
  }

  addToFavorites() {
    if (!this.auth.isLoggedIn()) {
      this.notify.show('Inicia sesión primero', 'info');
      return;
    }
    if (!this.hero?.id) return;
    this.favService.addFavorite(this.hero.id).subscribe({
      next: () => {
        this.notify.show('Añadido a favoritos', 'success');
        if (this.hero) this.hero.esFavorito = true;
      },
      error: (err) => {
        console.error(err);
        this.notify.show('Error al añadir a favoritos', 'error');
      },
    });
  }

  addToCart() {
    if (!this.auth.isLoggedIn()) {
      this.notify.show('Inicia sesión primero', 'info');
      return;
    }
    if (!this.hero?.id) return;
    this.cartService.addToCart(this.hero.id).subscribe({
      next: () => {
        this.notify.show('Añadido al carrito', 'success');
      },
      error: (err) => {
        console.error(err);
        this.notify.show('Error al añadir al carrito', 'error');
      },
    });
  }

  buyNow() {
    if (!this.auth.isLoggedIn()) {
      this.notify.show('Inicia sesión primero', 'info');
      return;
    }
    if (!this.hero?.id) return;
    this.cartService.addToCart(this.hero.id).subscribe({
      next: () => {
        this.notify.show('Producto agregado. Redirigiendo al carrito...', 'success');
        this.router.navigate(['/carrito']);
      },
      error: (err) => {
        console.error(err);
        this.notify.show('Error al procesar la compra', 'error');
      },
    });
  }
}
