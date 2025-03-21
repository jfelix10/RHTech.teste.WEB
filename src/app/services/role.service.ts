import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  userRole = 'Pendingzz';
  private roleSource: BehaviorSubject<string>;
  currentRole;

  constructor() {
    // Tenta recuperar a role do sessionStorage, se não houver, define como "Pending"
    const storedRole = sessionStorage.getItem('authToken');

    if (storedRole) {
      this.userRole = JSON.parse(atob(storedRole.split('.')[1])).role;
    }

    // Define o valor inicial
    this.roleSource = new BehaviorSubject<string>(this.userRole);

    // Torna observável
    this.currentRole = this.roleSource.asObservable(); 
  }

  // Atualiza a Role no serviço e no sessionStorage
  updateRole(newRole: string): void {
    this.roleSource.next(newRole); 
  }
}
