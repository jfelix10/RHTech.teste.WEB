import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { ModalService } from '../services/modal/modal.service';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../components/empresa-modal/modal.component';

@Component({
  selector: 'app-todos-usuarios',
  imports: [ModalComponent, FormsModule, CommonModule],
  templateUrl: './todos-usuarios.component.html',
  styleUrl: './todos-usuarios.component.css'
})
export class TodosUsuariosComponent implements OnInit {
  users: any[] = [];
  errorMessage: string = '';
  selectedUser: any = {};

  constructor(private userService: UserService, protected modalService: ModalService,) {}
  

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        console.log("USUARIOS: ", data);
        this.users = data.response.data;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar os usuários. Tente novamente.';
      }
    });
  }

  deleteUser(id: string): void {
    console.log("id BOTÃO: ", id);
    if (confirm('Tem certeza que deseja desativar este usuário?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id); // Remove da grid
          alert('Usuário desativado com sucesso.');
        },
        error: () => {
          alert('Erro ao tentar desativar o usuário. Tente novamente.');
        }
      });
    }
  }

  openEditModal(user: any): void {
    this.selectedUser = { ...user }; // Clona o objeto para edição
    this.modalService.open('edit-user-modal'); // Abre o modal
  }

  saveUser(): void {
    const updates = {
      name: this.selectedUser.name,
      role: this.selectedUser.role
    };

    this.userService.updateUser(this.selectedUser.id, updates).subscribe({
      next: () => {
        alert('Usuário atualizado com sucesso.');
        this.modalService.close(); // Fecha o modal
        this.loadUsers(); // Atualiza a lista de usuários
      },
      error: () => {
        alert('Erro ao atualizar o usuário. Tente novamente.');
      }
    });
  }
}
