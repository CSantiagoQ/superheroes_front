import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Order, OrdersService } from '../../services/orders.service';
import { NotifyService } from '../../services/notify.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  private ordersService = inject(OrdersService);
  private notify = inject(NotifyService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.ordersService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 401) {
          this.notify.show('Tu sesion ha expirado. Inicia sesion de nuevo', 'error');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.notify.show('Error al cargar pedidos', 'error');
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
