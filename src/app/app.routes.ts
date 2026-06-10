import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CatalogComponent } from './pages/catalog/catalog.component'; // Importa tu componente
import { AuthGuard } from './guards/auth.guard-guard';
import { UserRegistrationComponent } from './pages/user-registration/user-registration.component';

import { AboutComponent } from './pages/about/about.component';
import { Login } from './pages/login/login';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { AddHeroComponent } from './pages/add-hero/add-hero.component';
import { CartComponent } from './pages/cart/cart.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { HeroDetailComponent } from './pages/hero-detail/hero-detail.component';
export const routes: Routes = [
  { path: 'catalog', component: CatalogComponent }, // canActivate: [AuthGuard]
  { path: 'hero/:id', component: HeroDetailComponent },
  { path: 'user-registration', component: UserRegistrationComponent },
  { path: 'add-hero', component: AddHeroComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: Login },
  { path: 'favoritos', component: FavoritesComponent, canActivate: [AuthGuard] },
  { path: 'carrito', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'pedidos', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: '**', component: CatalogComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
