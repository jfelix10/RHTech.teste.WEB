import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';

@Injectable({
  providedIn: 'root' // Isso garante que o AuthGuard seja registrado como um serviço único
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('authToken'); // Verifica se há um token no localStorage
    if (token) {
      return true; // Permite acesso se o token existir
    }

    // Redireciona para a tela de login caso não haja token
    this.router.navigate([""]);
    return false;
  }
}
