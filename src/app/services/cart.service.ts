import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AuthData } from '../auth-data';

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

  private cart: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private isLoggedIn = false;
  
  cart$ = this.cartSubject.asObservable();

  constructor() {
    // Escuchar cambios de autenticación
    this.authData.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        // Usuario logueado: cargar carrito de BD
        this.loadCartFromServer();
      } else {
        // Sin sesión: cargar de localStorage
        this.loadCartFromLocalStorage();
      }
    });
  }

  private loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.cartSubject.next(this.cart);
    }
  }

  private loadCartFromServer() {
    this.http.get<any>(`${this.apiUrl}/carrito.php`, { withCredentials: true })
      .subscribe({
        next: (resp) => {
          if (resp.exito) {
            this.cart = resp.carrito;
            this.cartSubject.next(this.cart);
            // Sincronizar con localStorage también
            localStorage.setItem('cart', JSON.stringify(this.cart));
          }
        },
        error: () => this.loadCartFromLocalStorage()
      });
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.cartSubject.next(this.cart);
  }

  private syncWithServer(productId: number, cantidad: number) {
    this.http.post(`${this.apiUrl}/carrito.php`, 
      { producto_id: productId, cantidad: cantidad },
      { withCredentials: true }
    ).subscribe();
  }

  private deleteFromServer(productId: number) {
    this.http.delete(`${this.apiUrl}/carrito.php?producto_id=${productId}`, 
      { withCredentials: true }
    ).subscribe();
  }

  addToCart(product: any, cantidad: number = 1): void {
    const existingItem = this.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.cantidad += cantidad;
    } else {
      this.cart.push({
        id: product.id,
        nombre: product.nombre,
        precio: parseFloat(product.precio),
        imagen: product.imagen,
        cantidad: cantidad
      });
    }
    
    this.saveCart();
    
    if (this.isLoggedIn) {
      const totalCantidad = this.cart.find(i => i.id === product.id)?.cantidad || cantidad;
      this.syncWithServer(product.id, totalCantidad);
    }
  }

  removeFromCart(productId: number): void {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    if (this.isLoggedIn) {
      this.deleteFromServer(productId);
    }
  }

  updateQuantity(productId: number, cantidad: number): void {
    const item = this.cart.find(i => i.id === productId);
    if (item) {
      item.cantidad = cantidad;
      if (item.cantidad <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart();
        if (this.isLoggedIn) {
          this.syncWithServer(productId, cantidad);
        }
      }
    }
  }

  getCart(): CartItem[] {
    return this.cart;
  }

  isInCart(productId: number): boolean {
    return this.cart.some(item => item.id === productId);
  }

  getQuantityInCart(productId: number): number {
    const item = this.cart.find(i => i.id === productId);
    return item ? item.cantidad : 0;
  }

  getItemCount(): number {
    return this.cart.reduce((total, item) => total + item.cantidad, 0);
  }

  getTotal(): number {
    return this.cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  clearCart(): void {
    this.cart = [];
    this.saveCart();
    if (this.isLoggedIn) {
      this.http.delete(`${this.apiUrl}/carrito.php`, { withCredentials: true }).subscribe();
    }
  }
}
