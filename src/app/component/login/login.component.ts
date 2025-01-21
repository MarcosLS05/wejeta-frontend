import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(event: Event): void {
    event.preventDefault(); // Evita la recarga de la página al enviar el formulario
    this.authService.login(this.loginData).subscribe({
      next: (token) => {
        localStorage.setItem('authToken', token);
        this.router.navigate(['/home']); // Redirige a la página principal
      },
      error: () => {
        this.errorMessage = 'Credenciales incorrectas. Por favor, inténtelo de nuevo.';
      },
    });
  }
}
