import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'https://localhost:7002/api/v1/Auth';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  register(name: string, email: string, password: string): Observable<{ token: string }> {
    const url = `${this.baseUrl}/register`; // Rota de registro
    return this.http.post<{ token: string }>(url, { name, email, password });
  }


  login(email: string, password: string): Observable<{ message: string, token: string }> {
    const url = `${this.baseUrl}/login`; // Rota de login
    return this.http.post<{ message: string, token: string }>(url, { email, password });
  }

  updateRole(updateRoleUser: any): Observable<{ token: string }> {
    const url = `${this.baseUrl}/update-role`; // Rota de login
    return this.http.put<{ token: string }>(url, updateRoleUser);
  }


  saveToken(token: string): void {
    sessionStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  clearToken(): void {
    sessionStorage.removeItem('authToken');
  }

  // Método para decodificar o token
  decodeToken(token: string): any {
    return this.jwtHelper.decodeToken(token);
  }

  // Verifica se o token expirou
  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }
}
