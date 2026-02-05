import { Component, inject, OnInit } from '@angular/core';
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
export class ProductoDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productData = inject(ProductData);
  private cartService = inject(CartService);

  producto: any = null;
  cantidad: number = 1;
  addedToCart: boolean = false;
  cantidadEnCarrito: number = 0;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(parseInt(id));
      
      this.cartService.cart$.subscribe(cart => {
        const item = cart.find(i => i.id === parseInt(id));
        this.cantidadEnCarrito = item ? item.cantidad : 0;
      });
    }
  }

  loadProduct(id: number) {
    this.productData.getProducts().subscribe((resp: any) => {
      if (resp.exito) {
        this.producto = resp.productos.find((p: any) => p.id == id);
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  decrementQuantity() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  incrementQuantity() {
    if (this.producto && this.cantidad < this.producto.stock) {
      this.cantidad++;
    }
  }

  addToCart() {
    if (this.producto) {
      this.cartService.addToCart(this.producto, this.cantidad);
      this.addedToCart = true;
      setTimeout(() => {
        this.addedToCart = false;
      }, 2000);
    }
  }
}
