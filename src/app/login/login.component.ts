import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ValidateEqualDirective } from '../commons/directives/validate-equal.directive';
import { EmailValidatorDirective } from '../commons/directives/email-validator.directive';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ValidateEqualDirective, EmailValidatorDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoginMode = false;
  primeiroAcesso = false;

  form = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  constructor(private authService: AuthService, private router: Router) {
    this.resetForm();
   }

  // Alterna entre os modos Cadastro e Login
  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.resetForm();
  }

  // Lógica ao enviar o formulário
  onSubmit(userForm: any): void {
    if (userForm.invalid) {
      return;
    }

    //Modo Cadastro
    if (!this.isLoginMode) 
    {
      this.authService.register(this.form.name, this.form.email, this.form.password)
      .subscribe({
        next: (response) => {
          this.authService.saveToken(response.token);
          const decodedToken = this.authService.decodeToken(response.token);
          console.log('Conteúdo do token:', decodedToken);
          alert('Cadastro realizado com sucesso!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Erro ao cadastrar:', err);
          alert('Erro ao realizar o cadastro.');
        }
      });
    }
    else if(this.primeiroAcesso)
    {      
      this.authService.register(this.form.name, this.form.email, this.form.password)
      .subscribe({
        next: (response) => {
          this.authService.saveToken(response.token);
          const decodedToken = this.authService.decodeToken(response.token);
          console.log('Conteúdo do token:', decodedToken);
          alert('Cadastro realizado com sucesso!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Erro ao cadastrar:', err);
          alert('Erro ao realizar o cadastro.');
        }
      });
    }
    else 
    {
      // Modo Login
      this.authService.login(this.form.email, this.form.password)
        .subscribe({
          next: (response) => {
            if(response.message == 'primeiro acesso') 
            {
              this.primeiroAcesso = true;
            }
            else 
            {
              this.authService.saveToken(response.token);
              this.router.navigate(['/dashboard']);
            }
          },
          error: (err) => {
            console.error('Erro ao fazer login:', err);
            alert('Credenciais inválidas.');
          }
        });
    }
  }

  // Reseta o formulário
  private resetForm(): void {
    this.form = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    };
  }
}