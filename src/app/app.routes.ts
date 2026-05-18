import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CatalogComponent } from './pages/catalog/catalog.component'; // Importa tu componente
import { AuthGuard } from './guards/auth.guard-guard';
import { UserRegistrationComponent } from './pages/user-registration/user-registration.component';

// import { About } from './pages/about/about';
import { Login } from './pages/login/login';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { AddHeroComponent } from './pages/add-hero/add-hero.component';
export const routes: Routes = [
  { path: 'catalog', component: CatalogComponent }, // canActivate: [AuthGuard]
  { path: 'user-registration', component: UserRegistrationComponent },
  { path: 'add-hero', component: AddHeroComponent, canActivate: [AuthGuard] },
  // { path: 'about', component: About },
  { path: 'login', component: Login },
  { path: 'favoritos', component: FavoritesComponent, canActivate: [AuthGuard] },
  { path: '**', component: CatalogComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
