import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-modal.component.html',
  styleUrl: './cart-modal.component.css'
})
export class CartModalComponent {
  @Output() close = new EventEmitter<void>();

  cartService = inject(CartService);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost/DWEC/Angular/ProyectoMio/backend';

  cartItems: CartItem[] = [];
  purchaseSuccess = false;
  purchaseMessage = '';
  isProcessing = false;
  pedidoGuardado = false;

  // =============================================
  // VARIABLES PARA GASTOS DE ENVIO
  // =============================================
  minimoParaEnvioGratis = 50;
  precioEnvio = 3.99;
  subtotal = 0;
  envioGratis = false;
  gastosEnvio = 0;
  faltaParaEnvioGratis = 0;
  total = 0;

  constructor() {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.calcularTotales();
    });
  }

  // =============================================
  // FUNCION QUE CALCULA TODOS LOS TOTALES
  // =============================================
  calcularTotales() {
    this.subtotal = this.cartService.getTotal();

    if (this.subtotal >= this.minimoParaEnvioGratis) {
      this.envioGratis = true;
      this.gastosEnvio = 0;
      this.faltaParaEnvioGratis = 0;
    } else {
      this.envioGratis = false;
      this.gastosEnvio = this.precioEnvio;
      this.faltaParaEnvioGratis = this.minimoParaEnvioGratis - this.subtotal;
    }

    this.total = this.subtotal + this.gastosEnvio;
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

  // =============================================
  // COMPRAR - Procesa la compra
  // =============================================
  comprar() {
    if (this.cartItems.length === 0) {
      return;
    }

    this.purchaseSuccess = false;
    this.purchaseMessage = '';
    this.pedidoGuardado = false;

    // Validar direccion
    if (this.direccionEnvio.trim() === '') {
      this.purchaseMessage = 'Por favor, introduce una direccion de envio';
      return;
    }

    this.isProcessing = true;

    const purchaseData = {
      items: this.cartItems.map(item => ({
        id: item.id,
        cantidad: item.cantidad
      }))
    };

    this.http.post<any>(this.apiUrl + '/comprar.php', purchaseData, { withCredentials: true })
      .subscribe(
        (response) => {
          if (response.exito) {
            this.generarFactura();
          } else {
            this.isProcessing = false;
            this.purchaseMessage = response.mensaje;
          }
        },
        () => {
          this.isProcessing = false;
          this.purchaseMessage = 'Error de conexion';
        }
      );
  }

  // #############################################
  // #############################################
  // ##                                         ##
  // ##          HECHO CON IA                   ##
  // ##   Generacion de QR, Factura y Direccion ##
  // ##                                         ##
  // #############################################
  // #############################################

  // Variables para la factura y QR
  facturaUrl = '';
  facturaId = '';
  qrUrl = '';
  direccionEnvio = '';

  // Funcion que genera la factura HTML y el QR
  generarFactura() {
    const facturaData = {
      items: this.cartItems.map(item => ({
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad
      })),
      subtotal: this.subtotal,
      envio: this.gastosEnvio,
      total: this.total,
      direccion: this.direccionEnvio
    };

    this.http.post<any>(this.apiUrl + '/generar_factura.php', facturaData, { withCredentials: true })
      .subscribe(
        (response) => {
          if (response.exito) {
            this.facturaId = response.facturaId;
            this.facturaUrl = response.facturaUrl;

            this.qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&format=png&data=' +
              encodeURIComponent(this.facturaUrl);

            this.guardarPedido();
          } else {
            this.isProcessing = false;
            this.purchaseMessage = 'Error al generar la factura';
          }
        },
        () => {
          this.isProcessing = false;
          this.purchaseMessage = 'Error al generar la factura';
        }
      );
  }

  guardarPedido() {
    const pedidoData = {
      items: this.cartItems.map(item => ({
        id: item.id,
        cantidad: item.cantidad
      })),
      facturaId: this.facturaId,
      facturaUrl: this.facturaUrl
    };

    this.http.post<any>(this.apiUrl + '/compras.php', pedidoData, { withCredentials: true })
      .subscribe(
        (response) => {
          this.isProcessing = false;

          if (response.exito) {
            this.pedidoGuardado = true;
            this.purchaseMessage = 'Compra realizada con exito. Pedido guardado.';
          } else {
            this.purchaseMessage = 'Compra realizada, pero no se pudo guardar el pedido.';
          }

          this.purchaseSuccess = true;
          this.cartService.clearCart();
        },
        () => {
          this.isProcessing = false;
          this.purchaseSuccess = true;
          this.purchaseMessage = 'Compra realizada, pero no se pudo guardar el pedido.';
          this.cartService.clearCart();
        }
      );
  }

  // #############################################
  // ##        FIN HECHO CON IA                 ##
  // #############################################
}
