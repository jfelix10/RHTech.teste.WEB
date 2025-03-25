import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { ModalService } from '../services/modal/modal.service';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../components/empresa-modal/modal.component';
import { ValidateEqualDirective } from '../commons/directives/validate-equal.directive';

@Component({
  selector: 'app-todos-usuarios',
  imports: [ModalComponent, FormsModule, CommonModule, ValidateEqualDirective],
  templateUrl: './todos-usuarios.component.html',
  styleUrl: './todos-usuarios.component.css'
})
export class TodosUsuariosComponent implements OnInit {
  users: any[] = [];
  errorMessage: string = '';
  selectedUser: any = { name: '', role: '' };
  payload: any;
  serverErrors: string[] = [];
  serverMessage: any;
  formAddUser: any = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private userService: UserService, protected modalService: ModalService,) { }


  ngOnInit(): void {
    this.loadUsers();
    this.getToken();
  }

  getToken(): void {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      this.payload = JSON.parse(atob(token.split('.')[1]));
    }
  }

  loadUsers(): void {
    this.serverErrors = [];
    this.serverMessage = null;
  
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success) {
          console.log("response:: ", response.data);
          this.users = response.data || [];
          this.serverMessage = 'Usuários carregados com sucesso.';
        } else {
          this.serverErrors = [response.message || 'Erro ao carregar os usuários.'];
        }
      },
      error: (errorResponse) => {
        if (errorResponse.status === 500) {
          this.serverErrors = ['Erro interno no servidor. Tente novamente mais tarde.'];
        } else {
          this.serverErrors = ['Erro ao carregar os usuários. Tente novamente.'];
        }
      }
    });
  }

  deleteUser(id: string): void {
    const confirmation = confirm('Tem certeza que deseja desativar este usuário?');
    if (!confirmation) return;
  
    this.serverErrors = [];
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.serverMessage = 'Usuário desativado com sucesso.';
        this.loadUsers();
      },
      error: (errorResponse) => {
        // Trata as respostas do backend
        if (errorResponse.status === 404) {
          this.serverErrors = ['Usuário não encontrado.'];
        } else if (errorResponse.status === 500) {
          this.serverErrors = ['Erro interno no servidor. Tente novamente mais tarde.'];
        } else {
          this.serverErrors = ['Erro ao tentar desativar o usuário. Tente novamente.'];
        }
      }
    });
  }

  setSelectedUserId(user: any) {
    this.selectedUser.userId = user.id;
  }

  addUser(userForm: any): void {
    userForm.onSubmit(null);

    if (userForm.invalid) {
      this.serverErrors = ["Por favor, corrija os erros do formulário antes de continuar."]; 
      return;
    }

    const userPayload = {
      name: this.formAddUser.name,
      email: this.formAddUser.email,
      password: this.formAddUser.password,
      idEmpresa: this.payload.idEmpresa
    };

    this.serverErrors = [];
    this.userService.addUser(userPayload).subscribe({
      next: (response) => {
        this.modalService.close();
        this.formAddUser = {};
        this.serverErrors = [];
        this.loadUsers()
      },
      error: (errorResponse) => {
        if (errorResponse.status === 422) {
          this.serverErrors = errorResponse.error.errors || ["Erro de validação."];
        } else if (errorResponse.status === 500) {
          this.serverErrors = ["Erro interno no servidor. Tente novamente mais tarde."];
        } else {
          this.serverErrors = ["Ocorreu um erro ao adicionar o usuário. Tente novamente."];
        }
      }
    });
  }

  saveUser(userForm: any): void {
    userForm.onSubmit(null);
    if (userForm.invalid) {
      this.serverErrors = ["ainda existem erros a serem corrigidos."];
      return;
    }

    const updates = {
      name: this.selectedUser.name,
      role: this.selectedUser.role
    };

    this.serverErrors = [];
    this.userService.updateUser(this.selectedUser.userId, updates).subscribe({
      next: () => {
        this.modalService.close();
        this.loadUsers();
        this.serverErrors = [];
      },
      error: (errorResponse) => {
        if (errorResponse.status === 400) {
          this.serverErrors = errorResponse.error.errors || ["Erro de validação."];
        } else if (errorResponse.status === 404) {
          this.serverErrors = ["Usuário não encontrado."];
        } else if (errorResponse.status === 500) {
          this.serverErrors = ["Erro interno no servidor. Tente novamente mais tarde."];
        } else {
          this.serverErrors = ["Ocorreu um erro ao atualizar o usuário. Tente novamente."];
        }
      }
    });
  }
}
