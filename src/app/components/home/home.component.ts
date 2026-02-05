import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductData } from '../../product-data';
import { SearchComponent } from '../search/search.component';
import { CategoryFilterComponent } from '../category-filter/category-filter.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SearchComponent, CategoryFilterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private data = inject(ProductData);
  private router = inject(Router);
  productos: any[] = [];
  productosTodos: any[] = [];
  filtroPrecio = 'none';

  constructor() {
    this.getProductos();
  }

  getProductos() {
    this.data.getProducts().subscribe(
      (resp: any) => {
        console.log('Respuesta del servidor:', resp);
        if (resp.exito) {
          this.productosTodos = resp.productos ?? [];
          this.ordenarPorPrecio();
          console.log('Productos cargados:', this.productos);
        } else {
          console.log('No hay productos o error:', resp);
        }
      }
    );
  }

  onCategoryChange(categoria: string) {
    if (categoria === '') {
      this.getProductos();
    } else {
      this.data.getProductsByCategory(categoria).subscribe(
        (resp: any) => {
          if (resp.exito) {
            this.productosTodos = resp.productos ?? [];
            this.ordenarPorPrecio();
          }
        },
        (error: any) => {
          console.error('Error al filtrar por categoria:', error);
        }
      );
    }
  }

  onPriceFilterChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.filtroPrecio = select.value;
    this.ordenarPorPrecio();
  }

  ordenarPorPrecio() {
    this.productos = [...this.productosTodos];

    if (this.filtroPrecio === 'asc') {
      this.productos.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
    }

    if (this.filtroPrecio === 'desc') {
      this.productos.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
    }
  }

  verDetalle(id: number) {
    this.router.navigate(['/producto', id]);
  }
}
