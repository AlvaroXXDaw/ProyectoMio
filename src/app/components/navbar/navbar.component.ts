import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartModalComponent } from '../cart-modal/cart-modal.component';
import { AuthData } from '../../auth-data';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, CartModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  // Variables para saber si el usuario está logueado y si es admin
  isAdmin = false;
  isLoggedIn = false;
  showCartModal = false;

  // Número de productos en el carrito
  cartItemCount = 0;

  // Servicios inyectados
  cartService = inject(CartService);
  authData = inject(AuthData);
  router = inject(Router);

  constructor() {
    // =============================================
    // Escuchamos los cambios del usuario logueado
    // =============================================
    this.authData.user$.subscribe(user => {
      // ¿Hay un usuario logueado?
      if (user) {
        this.isLoggedIn = true;

        // ¿Es jefe (admin)?
        if (user.rol === 'jefe') {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      } else {
        // No hay usuario logueado
        this.isLoggedIn = false;
        this.isAdmin = false;
      }
    });

    // =============================================
    // Escuchamos los cambios del carrito
    // =============================================
    this.cartService.cart$.subscribe(carrito => {
      // Contamos cuántos productos hay en total
      let total = 0;
      carrito.forEach(item => {
        total = total + item.cantidad;
      });
      this.cartItemCount = total;
    });
  }

  // Abrir o cerrar el modal del carrito
  toggleCart() {
    if (this.showCartModal === true) {
      this.showCartModal = false;
    } else {
      this.showCartModal = true;
    }
  }

  // Cerrar el modal del carrito
  closeCart() {
    this.showCartModal = false;
  }

  // Cerrar sesión
  logout() {
    this.authData.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
