import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../../auth-data';

export interface CompraItem {
  compra_id: number;
  producto_id: number;
  producto_nombre: string;
  producto_imagen: string;
  cantidad: number;
  precio_unitario: number;
  total: number;
  fecha_compra: string;
  factura_id: string | null;
  factura_url: string | null;
}

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-pedidos.component.html',
  styleUrl: './mis-pedidos.component.css'
})
export class MisPedidosComponent {
  private http = inject(HttpClient);
  private authData = inject(AuthData);
  private apiUrl = 'http://localhost/DWEC/Angular/ProyectoMio/backend';

  compras: CompraItem[] = [];
  loading = true;
  errorMessage = '';
  totalCompras = 0;
  totalGastado = 0;
  isLoggedIn = false;
  isAdmin = false;
  userName = '';

  constructor() {
    this.authData.user$.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.isAdmin = user.rol === 'jefe';
        this.userName = user.nombre || '';

        if (!this.isAdmin) {
          this.cargarCompras();
        } else {
          this.loading = false;
        }
      } else {
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.loading = false;
        this.compras = [];
        this.totalCompras = 0;
        this.totalGastado = 0;
      }
    });
  }

  cargarCompras() {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any>(this.apiUrl + '/compras.php', { withCredentials: true })
      .subscribe(
        (response) => {
          if (response.exito) {
            this.compras = response.compras || [];
            this.totalCompras = response.total_compras || 0;
            this.totalGastado = response.total_gastado || 0;
          } else {
            this.errorMessage = 'No se pudo cargar el historial de pedidos.';
          }
          this.loading = false;
        },
        () => {
          this.errorMessage = 'Error de conexion al cargar pedidos.';
          this.loading = false;
        }
      );
  }

  formatFecha(fecha: string) {
    if (!fecha) {
      return '';
    }
    return new Date(fecha).toLocaleString('es-ES');
  }
}
