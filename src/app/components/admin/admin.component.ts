import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProductData } from '../../product-data';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  private http = inject(HttpClient);
  private productData = inject(ProductData);
  private apiUrl = 'http://localhost/DWEC/Angular/ProyectoMio/backend';
  
  productos: any[] = [];
  mensaje = '';
  mensajeError = false;
  
  mostrarModalAnadir = false;
  nuevoProducto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagen: '',
    categoria: ''
  };
  
  mostrarModalEditar = false;
  productoEditando: any = null;
  nuevoStock = 0;

  constructor() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productData.getProducts().subscribe((resp: any) => {
      if (resp.exito) {
        this.productos = resp.productos;
      }
    });
  }

  obtenerTotal() {
    return this.productos.length;
  }

  obtenerConStock() {
    let cuenta = 0;
    for (let p of this.productos) {
      if (p.stock > 0) {
        cuenta++;
      }
    }
    return cuenta;
  }

  obtenerSinStock() {
    let cuenta = 0;
    for (let p of this.productos) {
      if (p.stock == 0) {
        cuenta++;
      }
    }
    return cuenta;
  }

  obtenerValorTotal() {
    let suma = 0;
    for (let p of this.productos) {
      suma = suma + (p.precio * p.stock);
    }
    return suma;
  }

  abrirModalAnadir() {
    this.mostrarModalAnadir = true;
    this.nuevoProducto = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      imagen: '',
      categoria: ''
    };
  }

  cerrarModalAnadir() {
    this.mostrarModalAnadir = false;
  }

  guardarNuevoProducto() {
    if (this.nuevoProducto.nombre === '' || this.nuevoProducto.precio <= 0) {
      this.mostrarMensaje('Nombre y precio son obligatorios', true);
      return;
    }

    this.http.post(`${this.apiUrl}/crear_producto.php`, this.nuevoProducto)
      .subscribe({
        next: (resp: any) => {
          if (resp.exito) {
            this.mostrarMensaje('Producto añadido correctamente', false);
            this.cerrarModalAnadir();
            this.cargarProductos();
          } else {
            this.mostrarMensaje(resp.mensaje, true);
          }
        },
        error: () => {
          this.mostrarMensaje('Error de conexión', true);
        }
      });
  }

  abrirModalEditar(producto: any) {
    this.productoEditando = producto;
    this.nuevoStock = producto.stock;
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar() {
    this.mostrarModalEditar = false;
    this.productoEditando = null;
  }

  guardarStock() {
    if (this.nuevoStock < 0) {
      this.mostrarMensaje('El stock no puede ser negativo', true);
      return;
    }

    let datosActualizados = {
      id: this.productoEditando.id,
      nombre: this.productoEditando.nombre,
      descripcion: this.productoEditando.descripcion,
      precio: this.productoEditando.precio,
      stock: this.nuevoStock,
      imagen: this.productoEditando.imagen
    };

    this.http.post(`${this.apiUrl}/editar_producto.php`, datosActualizados)
      .subscribe({
        next: (resp: any) => {
          if (resp.exito) {
            this.mostrarMensaje('Stock actualizado correctamente', false);
            this.cerrarModalEditar();
            this.cargarProductos();
          } else {
            this.mostrarMensaje(resp.mensaje, true);
          }
        },
        error: () => {
          this.mostrarMensaje('Error de conexión', true);
        }
      });
  }


  mostrarMensaje(texto: string, esError: boolean) {
    this.mensaje = texto;
    this.mensajeError = esError;
    
    setTimeout(() => {
      this.mensaje = '';
    }, 3000);
  }
}
