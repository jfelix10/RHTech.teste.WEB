import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private readonly baseUrl = 'https://localhost:7002/api/v1/Empresa';

  constructor(private http: HttpClient) {}

  criarEmpresa(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/criar-empresa`, data);
  }

  getEmpresa(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-empresa/${id}`);
  }
}
