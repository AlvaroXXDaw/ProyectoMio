import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductData {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost/DWEC/Angular/ProyectoMio/backend';

  getProducts() {
    return this.http.get<any>(`${this.apiUrl}/obtener_productos.php`);
  }

  getProductsByCategory(categoria: string) {
    return this.http.get<any>(`${this.apiUrl}/obtener_productos.php?categoria=${categoria}`);
  }

  getCategorias() {
    return this.http.get<any>(`${this.apiUrl}/obtener_categorias.php`);
  }

  buscarProducto(nombre: string) {
    return this.http.get<any>(`${this.apiUrl}/buscar_productos.php?nombre=${nombre}`);
  }

  filterByName(products: any[], pattern: string): any[] {
    if (!pattern || pattern.trim() === '') {
      return products;
    }
    return products.filter(p => p.nombre.toLowerCase().includes(pattern.toLowerCase()));
  }

  filterByMaxPrice(products: any[], maxPrice: string): any[] {
    if (maxPrice === '' || maxPrice === null) {
      return products;
    }
    const numPrice = parseFloat(maxPrice);
    return products.filter(p => parseFloat(p.precio) <= numPrice);
  }
}
