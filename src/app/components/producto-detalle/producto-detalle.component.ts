import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductData } from '../../product-data';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto-detalle.component.html',
  styleUrl: './producto-detalle.component.css'
})
export class ProductoDetalleComponent {
  // Servicios inyectados
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productData = inject(ProductData);
  private cartService = inject(CartService);

  // Datos del producto
  producto: any = null;
  cantidad: number = 1;
  addedToCart: boolean = false;
  cantidadEnCarrito: number = 0;

  constructor() {
    // =============================================
    // Obtenemos el ID del producto de la URL
    // =============================================
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // Cargamos el producto
      this.cargarProducto(parseInt(id));

      // Escuchamos los cambios del carrito para saber cuántos hay
      this.cartService.cart$.subscribe(carrito => {
        // Buscamos si este producto está en el carrito
        let encontrado = false;
        carrito.forEach(item => {
          if (item.id === parseInt(id)) {
            this.cantidadEnCarrito = item.cantidad;
            encontrado = true;
          }
        });

        // Si no lo encontramos, la cantidad es 0
        if (encontrado === false) {
          this.cantidadEnCarrito = 0;
        }
      });
    }
  }

  // =============================================
  // Función para cargar los datos del producto
  // =============================================
  cargarProducto(id: number) {
    this.productData.getProducts().subscribe((resp: any) => {
      if (resp.exito) {
        // Buscamos el producto por ID
        resp.productos.forEach((p: any) => {
          if (p.id == id) {
            this.producto = p;
          }
        });
      }
    });
  }

  // Volver a la página principal
  goBack() {
    this.router.navigate(['/']);
  }

  // Disminuir cantidad
  decrementQuantity() {
    if (this.cantidad > 1) {
      this.cantidad = this.cantidad - 1;
    }
  }

  // Aumentar cantidad
  incrementQuantity() {
    if (this.producto) {
      if (this.cantidad < this.producto.stock) {
        this.cantidad = this.cantidad + 1;
      }
    }
  }

  // Añadir al carrito
  addToCart() {
    if (this.producto) {
      this.cartService.addToCart(this.producto, this.cantidad);
      this.addedToCart = true;

      // Después de 2 segundos, ocultamos el mensaje
      setTimeout(() => {
        this.addedToCart = false;
      }, 2000);
    }
  }
}
