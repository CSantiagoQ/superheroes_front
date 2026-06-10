import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartItem, CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { NotifyService } from '../../services/notify.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  loading = true;
  checkoutLoading = false;
  private cartService = inject(CartService);
  private ordersService = inject(OrdersService);
  private notify = inject(NotifyService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    this.loadCart();
  }

  get total(): number {
    return this.cartItems.reduce((sum, item) => {
      return sum + this.getSubtotal(item);
    }, 0);
  }

  getSubtotal(item: CartItem): number {
    return Number(item.precio || 0) * item.quantity;
  }

  loadCart() {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cartItems = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.handleAuthError(err, 'Error al cargar el carrito');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  increment(item: CartItem) {
    if (item.id == null) {
      this.notify.show('No se pudo identificar el heroe seleccionado', 'error');
      return;
    }

    this.cartService.increment(item.id).subscribe({
      next: () => {
        item.quantity += 1;
        this.cdr.detectChanges();
      },
      error: (err) => this.handleAuthError(err, 'No se pudo incrementar la cantidad'),
    });
  }

  decrement(item: CartItem) {
    if (item.id == null) {
      this.notify.show('No se pudo identificar el heroe seleccionado', 'error');
      return;
    }

    this.cartService.decrement(item.id).subscribe({
      next: () => {
        if (item.quantity <= 1) {
          this.cartItems = this.cartItems.filter((cartItem) => cartItem.id !== item.id);
        } else {
          item.quantity -= 1;
        }
        this.cdr.detectChanges();
      },
      error: (err) => this.handleAuthError(err, 'No se pudo reducir la cantidad'),
    });
  }

  remove(item: CartItem) {
    if (item.id == null) {
      this.notify.show('No se pudo identificar el heroe seleccionado', 'error');
      return;
    }

    this.cartService.remove(item.id).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter((cartItem) => cartItem.id !== item.id);
        this.notify.show('Producto eliminado del carrito', 'info');
        this.cdr.detectChanges();
      },
      error: (err) => this.handleAuthError(err, 'No se pudo eliminar del carrito'),
    });
  }

  checkout() {
    if (this.cartItems.length === 0 || this.checkoutLoading) {
      return;
    }

    this.checkoutLoading = true;
    this.ordersService.checkout().subscribe({
      next: () => {
        this.cartItems = [];
        this.checkoutLoading = false;
        this.notify.show('Pedido creado con exito', 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.checkoutLoading = false;
        this.handleAuthError(err, 'No se pudo realizar el checkout');
        this.cdr.detectChanges();
      },
    });
  }

  goToCatalog() {
    this.router.navigate(['/catalog']);
  }

  private handleAuthError(err: { status?: number }, fallbackMessage: string) {
    if (err.status === 401) {
      this.notify.show('Tu sesion ha expirado. Inicia sesion de nuevo', 'error');
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }

    this.notify.show(fallbackMessage, 'error');
  }
}
