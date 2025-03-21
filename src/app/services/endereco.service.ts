import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {
  private baseUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  // Método para buscar endereço pelo CEP
  getEnderecoByCep(cep: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${cep}/json`);
  }
}
