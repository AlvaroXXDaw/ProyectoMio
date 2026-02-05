import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthData } from '../../auth-data';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  logged: boolean = false;
  username: string = "";

  private authData = inject(AuthData);
  private router = inject(Router);

  tryLogin(email: string, password: string) {
    if (email.length > 0 && password.length > 0) {
      this.authData.tryLogin(email, password).subscribe(
        (data: any) => {
          if (data.exito) {
            this.logged = true;
            this.username = data.usuario.nombre;
            
            // Redirect to home
            this.router.navigate(['/']);
          } else {
            alert(data.mensaje);
          }
        },
        (error: any) => {
          alert("Error en el login");
        }
      );
    }
  }
}
