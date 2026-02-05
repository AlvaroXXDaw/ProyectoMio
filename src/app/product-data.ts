import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductData {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost/DWEC/Angular/ProyectoMio/backend';

  // =============================================
  // Obtener todos los productos
  // =============================================
  getProducts() {
    return this.http.get<any>(`${this.apiUrl}/obtener_productos.php`);
  }

  // =============================================
  // Obtener productos por categoría
  // =============================================
  getProductsByCategory(categoria: string) {
    return this.http.get<any>(`${this.apiUrl}/obtener_productos.php?categoria=${categoria}`);
  }

  // =============================================
  // Obtener todas las categorías
  // =============================================
  getCategorias() {
    return this.http.get<any>(`${this.apiUrl}/obtener_categorias.php`);
  }

  // =============================================
  // Buscar productos por nombre
  // =============================================
  buscarProducto(nombre: string) {
    return this.http.get<any>(`${this.apiUrl}/buscar_productos.php?nombre=${nombre}`);
  }

  // =============================================
  // Filtrar productos por nombre (en el frontend)
  // =============================================
  filterByName(products: any[], pattern: string): any[] {
    // Si no hay patrón de búsqueda, devolvemos todos
    if (pattern === '' || pattern === null || pattern === undefined) {
      return products;
    }

    // Si el patrón solo tiene espacios, devolvemos todos
    if (pattern.trim() === '') {
      return products;
    }

    // Filtramos los productos que coinciden con el patrón
    let resultados: any[] = [];

    products.forEach(producto => {
      let nombreMinusculas = producto.nombre.toLowerCase();
      let patronMinusculas = pattern.toLowerCase();

      if (nombreMinusculas.includes(patronMinusculas)) {
        resultados.push(producto);
      }
    });

    return resultados;
  }

  // =============================================
  // Filtrar productos por precio máximo (en el frontend)
  // =============================================
  filterByMaxPrice(products: any[], maxPrice: string): any[] {
    // Si no hay precio máximo, devolvemos todos
    if (maxPrice === '' || maxPrice === null) {
      return products;
    }

    let precioMaximo = parseFloat(maxPrice);
    let resultados: any[] = [];

    products.forEach(producto => {
      let precioProducto = parseFloat(producto.precio);

      if (precioProducto <= precioMaximo) {
        resultados.push(producto);
      }
    });

    return resultados;
  }
}
