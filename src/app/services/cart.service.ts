import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AuthData } from '../auth-data';

// =============================================
// Interfaz que define cómo es un item del carrito
// =============================================
export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private authData = inject(AuthData);
  private apiUrl = 'http://localhost/DWEC/Angular/ProyectoMio/backend';

  // El carrito es un array de items
  private cart: CartItem[] = [];

  // BehaviorSubject para notificar cambios
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  // Variable para saber si el usuario está logueado
  private isLoggedIn = false;

  // Observable público del carrito
  cart$ = this.cartSubject.asObservable();

  constructor() {
    // =============================================
    // Escuchamos los cambios de autenticación
    // =============================================
    this.authData.user$.subscribe(user => {
      if (user) {
        // Usuario logueado: cargar carrito de la base de datos
        this.isLoggedIn = true;
        this.cargarCarritoServidor();
      } else {
        // Sin sesión: cargar de localStorage
        this.isLoggedIn = false;
        this.cargarCarritoLocal();
      }
    });
  }

  // =============================================
  // Cargar carrito desde localStorage
  // =============================================
  private cargarCarritoLocal() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.cartSubject.next(this.cart);
    }
  }

  // =============================================
  // Cargar carrito desde el servidor
  // =============================================
  private cargarCarritoServidor() {
    this.http.get<any>(`${this.apiUrl}/carrito.php`, { withCredentials: true })
      .subscribe({
        next: (resp) => {
          if (resp.exito) {
            this.cart = resp.carrito;
            this.cartSubject.next(this.cart);
            localStorage.setItem('cart', JSON.stringify(this.cart));
          }
        },
        error: () => {
          // Si hay error, cargamos del localStorage
          this.cargarCarritoLocal();
        }
      });
  }

  // =============================================
  // Guardar carrito en localStorage y notificar cambios
  // =============================================
  private guardarCarrito() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.cartSubject.next(this.cart);
  }

  // =============================================
  // Sincronizar con el servidor (para usuarios logueados)
  // =============================================
  private sincronizarServidor(productId: number, cantidad: number) {
    this.http.post(`${this.apiUrl}/carrito.php`,
      { producto_id: productId, cantidad: cantidad },
      { withCredentials: true }
    ).subscribe();
  }

  // =============================================
  // Eliminar del servidor
  // =============================================
  private eliminarDelServidor(productId: number) {
    this.http.delete(`${this.apiUrl}/carrito.php?producto_id=${productId}`,
      { withCredentials: true }
    ).subscribe();
  }

  // =============================================
  // Añadir producto al carrito
  // =============================================
  addToCart(product: any, cantidad: number = 1): void {
    // Buscamos si el producto ya existe en el carrito
    const productoExistente = this.cart.find(item => item.id === product.id);

    if (productoExistente) {
      // Si ya existe, aumentamos la cantidad
      productoExistente.cantidad = productoExistente.cantidad + cantidad;
    } else {
      // Si no existe, lo añadimos
      let nuevoItem: CartItem = {
        id: product.id,
        nombre: product.nombre,
        precio: parseFloat(product.precio),
        imagen: product.imagen,
        cantidad: cantidad
      };
      this.cart.push(nuevoItem);
    }

    this.guardarCarrito();

    // Si está logueado, sincronizamos con el servidor
    if (this.isLoggedIn) {
      let cantidadTotal = 0;
      this.cart.forEach(item => {
        if (item.id === product.id) {
          cantidadTotal = item.cantidad;
        }
      });
      this.sincronizarServidor(product.id, cantidadTotal);
    }
  }

  // =============================================
  // Eliminar producto del carrito
  // =============================================
  removeFromCart(productId: number): void {
    // Creamos un nuevo array sin el producto
    let nuevoCarrito: CartItem[] = [];

    this.cart.forEach(item => {
      if (item.id !== productId) {
        nuevoCarrito.push(item);
      }
    });

    this.cart = nuevoCarrito;
    this.guardarCarrito();

    if (this.isLoggedIn) {
      this.eliminarDelServidor(productId);
    }
  }

  // =============================================
  // Actualizar cantidad de un producto
  // =============================================
  updateQuantity(productId: number, cantidad: number): void {
    // Buscamos el producto
    const itemEncontrado = this.cart.find(item => item.id === productId);

    if (itemEncontrado) {
      itemEncontrado.cantidad = cantidad;

      // Si la cantidad es 0 o menor, eliminamos el producto
      if (itemEncontrado.cantidad <= 0) {
        this.removeFromCart(productId);
      } else {
        this.guardarCarrito();
        if (this.isLoggedIn) {
          this.sincronizarServidor(productId, cantidad);
        }
      }
    }
  }

  // =============================================
  // Obtener el carrito
  // =============================================
  getCart(): CartItem[] {
    return this.cart;
  }

  // =============================================
  // Verificar si un producto está en el carrito
  // =============================================
  isInCart(productId: number): boolean {
    let esta = false;

    this.cart.forEach(item => {
      if (item.id === productId) {
        esta = true;
      }
    });

    return esta;
  }

  // =============================================
  // Obtener la cantidad de un producto en el carrito
  // =============================================
  getQuantityInCart(productId: number): number {
    let cantidad = 0;

    this.cart.forEach(item => {
      if (item.id === productId) {
        cantidad = item.cantidad;
      }
    });

    return cantidad;
  }

  // =============================================
  // Obtener el número total de items en el carrito
  // =============================================
  getItemCount(): number {
    let total = 0;

    this.cart.forEach(item => {
      total = total + item.cantidad;
    });

    return total;
  }

  // =============================================
  // Obtener el precio total del carrito
  // =============================================
  getTotal(): number {
    let total = 0;

    this.cart.forEach(item => {
      total = total + (item.precio * item.cantidad);
    });

    return total;
  }

  // =============================================
  // Vaciar el carrito
  // =============================================
  clearCart(): void {
    this.cart = [];
    this.guardarCarrito();

    if (this.isLoggedIn) {
      this.http.delete(`${this.apiUrl}/carrito.php`, { withCredentials: true }).subscribe();
    }
  }
}


