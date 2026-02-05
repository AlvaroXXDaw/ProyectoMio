import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthData {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost/DWEC/Angular/ProyectoMio/backend';

  // Estado reactivo del usuario
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    this.checkAuth();
  }

  // Verificar sesión al inicio
  checkAuth() {
    this.http.get(`${this.apiUrl}/check_auth.php`, { withCredentials: true })
      .subscribe({
        next: (resp: any) => {
          if (resp.exito) {
            this.userSubject.next(resp.usuario);
          } else {
            this.userSubject.next(null);
          }
        },
        error: () => this.userSubject.next(null)
      });
  }

  tryLogin(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login.php`,
      { email, password },
      { withCredentials: true } // Importante para enviar cookies
    ).pipe(
      tap((resp: any) => {
        if (resp.exito) {
          this.userSubject.next(resp.usuario);
        }
      })
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout.php`, {}, { withCredentials: true })
      .pipe(
        tap(() => this.userSubject.next(null))
      );
  }

  tryRegister(nombre: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/registro.php`, {
      nombre, email, password
    });
  }
}
