import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { ProductoDetalleComponent } from './components/producto-detalle/producto-detalle.component';
import { CompraExitosaComponent } from './components/compra-exitosa/compra-exitosa.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  
  { path: 'producto/:id', component: ProductoDetalleComponent },
  { path: 'compra-exitosa', component: CompraExitosaComponent },
  { path: 'admin', component: AdminComponent },
  
  { path: '**', redirectTo: '' }
];
