import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginCredentials, LoginResponse } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string = '';
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  onLogin() {
    if (this.loginForm.valid) {
      console.log('Formulario de login válido:', this.loginForm.value);
      this.authService.login(this.loginForm.value as LoginCredentials).subscribe({
        next: (res: LoginResponse) => {
          this.authService.setLoginData(res.nombre, res.token);
          this.router.navigate(['/catalog']); // Redirigir al catálogo al entrar
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Credenciales inválidas';
        },
      });
    }
  }
}
