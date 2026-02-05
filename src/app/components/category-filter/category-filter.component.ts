import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductData } from '../../product-data';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.css'
})
export class CategoryFilterComponent implements OnInit {
  @Output() categorySelected = new EventEmitter<string>();
  
  private data = inject(ProductData);
  categorias: string[] = [];
  selectedCategory: string = '';

  ngOnInit() {
    this.loadCategorias();
  }

  loadCategorias() {
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

  selectCategory(categoria: string) {
    this.selectedCategory = categoria;
    this.categorySelected.emit(categoria);
  }
}
