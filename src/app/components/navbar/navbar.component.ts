import { Component, inject, OnInit } from '@angular/core';
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
export class NavbarComponent implements OnInit {
  isAdmin = false;
  isLoggedIn = false;
  showCartModal = false;
  
  cartService = inject(CartService);
  authData = inject(AuthData);
  router = inject(Router);

  ngOnInit() {
    this.authData.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.rol === 'jefe';
    });
  }

  get cartItemCount(): number {
    return this.cartService.getItemCount();
  }

  toggleCart() {
    this.showCartModal = !this.showCartModal;
  }

  closeCart() {
    this.showCartModal = false;
  }

  logout() {
    this.authData.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
