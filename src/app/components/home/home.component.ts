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
  
  constructor() {
    this.getProductos();
  }

  getProductos() {
    this.data.getProducts().subscribe(
      (resp: any) => {
        console.log('Respuesta del servidor:', resp);
        if (resp.exito) {
          this.productos = resp.productos;
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
            this.productos = resp.productos;
          }
        },
        (error: any) => {
          console.error('Error al filtrar por categoría:', error);
        }
      );
    }
  }

  verDetalle(id: number) {
    this.router.navigate(['/producto', id]);
  }
}
