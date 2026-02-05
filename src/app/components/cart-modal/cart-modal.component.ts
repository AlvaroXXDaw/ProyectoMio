import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-modal.component.html',
  styleUrl: './cart-modal.component.css'
})
export class CartModalComponent {
  @Output() close = new EventEmitter<void>();
  
  cartService = inject(CartService);
  private http = inject(HttpClient);
  
  cartItems: CartItem[] = [];
  purchaseSuccess = false;
  purchaseMessage = '';
  isProcessing = false;

  constructor() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  get total(): number {
    return this.cartService.getTotal();
  }

  updateQuantity(productId: number, change: number) {
    const item = this.cartItems.find(i => i.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.cantidad + change);
    }
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  closeModal() {
    this.close.emit();
  }

  comprar() {
    if (this.cartItems.length === 0) return;
    
    this.isProcessing = true;
    
    const purchaseData = {
      items: this.cartItems.map(item => ({
        id: item.id,
        cantidad: item.cantidad
      }))
    };

    this.http.post<any>('http://localhost/DWEC/Angular/ProyectoMio/backend/comprar.php', purchaseData)
      .subscribe(
        (response) => {
          this.isProcessing = false;
          if (response.exito) {
            this.purchaseSuccess = true;
            this.purchaseMessage = '¡Compra realizada con éxito!';
            this.cartService.clearCart();
          } else {
            this.purchaseMessage = response.mensaje || 'Error al procesar la compra';
          }
        },
        (error) => {
          this.isProcessing = false;
          this.purchaseMessage = 'Error de conexión';
        }
      );
  }
}
