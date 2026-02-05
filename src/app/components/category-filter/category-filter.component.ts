import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductData } from '../../product-data';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.css'
})
export class CategoryFilterComponent {
  // Evento que se emite cuando el usuario selecciona una categoría
  @Output() categorySelected = new EventEmitter<string>();

  // Servicio para obtener datos
  private data = inject(ProductData);

  // Lista de categorías disponibles
  categorias: string[] = [];

  // Categoría actualmente seleccionada
  selectedCategory: string = '';

  constructor() {
    // Cargamos las categorías al iniciar el componente
    this.cargarCategorias();
  }

  // =============================================
  // Función para cargar las categorías del servidor
  // =============================================
  cargarCategorias() {
    this.data.getCategorias().subscribe(
      (resp: any) => {
        if (resp.exito) {
          this.categorias = resp.categorias;
        }
      },
      (error: any) => {
        console.error('Error al cargar categorías:', error);
      }
    );
  }

  // =============================================
  // Función para seleccionar una categoría
  // =============================================
  selectCategory(categoria: string) {
    this.selectedCategory = categoria;
    // Emitimos la categoría seleccionada al componente padre
    this.categorySelected.emit(categoria);
  }
}
