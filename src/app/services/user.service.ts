import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://localhost:7002/api/v1/users'; // Ajuste conforme sua API

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get-users`);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/delete-user/${userId}`, null);
  }

  updateUser(userId: string, userUpdates: { name: string; role: string }): Observable<any> {
    return this.http.patch(`${this.baseUrl}/alter-user`, { userId, ...userUpdates });
  }
}
