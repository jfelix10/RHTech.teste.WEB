import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../services/empresa.service';
import { ModalService } from '../services/modal/modal.service';
import { ModalComponent } from "../components/empresa-modal/modal.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { RoleService } from '../services/role.service';
import { EnderecoService } from '../services/endereco.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-minha-empresa',
  imports: [ModalComponent, FormsModule, CommonModule, NgxMaskDirective],
  providers: [
    provideNgxMask(),
  ],
  templateUrl: './minha-empresa.component.html',
  styleUrl: './minha-empresa.component.css'
})
export class MinhaEmpresaComponent implements OnInit {
  firstName = '';
  userRole = '';
  isOpenModal = false;
  payload: any;
  tiposEmpresa = [
    { codtipoempresa: '', nometipoempresa: 'Selecione um tipo de empresa'},
    { codtipoempresa: 1, nometipoempresa: 'MEI' },
    { codtipoempresa: 2, nometipoempresa: 'LTDA' },
    { codtipoempresa: 3, nometipoempresa: 'EIRELI' }
  ];
  estados = ['SP', 'RJ', 'MG', 'RS', 'BA', 'PR', 'SC', 'PE', 'CE', 'AM', 'DF'];
  form = {
    nomeEmpresa: '',
    cnpj: '',
    codTipoEmpresa: '',
    cep: '',
    logradouro: '',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: '',
    complemento: '',
    celular: '',
    nomeAdministradorEmpresa: '',
    cpf: '',
    email: ''
  };

  empresaData: any;

  updateRoleUser = {
    name: '',
    email: '',
    role: ''
  };

  constructor(
    private empresaService: EmpresaService,
    protected modalService: ModalService,
    protected authService: AuthService,
    private router: Router,
    private roleService: RoleService,
    private enderecoService: EnderecoService
  ) { }

  ngOnInit(): void {
    // Pegar o primeiro nome do usuário a partir do token JWT
    this.getToken();
    this.firstName = this.payload.unique_name ? this.payload.unique_name.split(' ')[0] : 'Usuário';
    this.userRole = this.payload.role ? this.payload.role : 'Perfil qualquer';

    this.empresaData = {
      NomeEmpresa: '',
      CNPJ: '',
      NomeAdministradorEmpresa: '',
      CPF: '',
      Email: '',
      Celular: '',
      CEP: '',
      Endereco: '',
      Cidade: '',
      Estado: ''
    };

    if(this.payload.idEmpresa)
    {
      this.getEmpresa(this.payload.idEmpresa);
    }

    // seta modal fechada
    this.isOpenModal = false;
  }

  getToken(): void {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      this.payload = JSON.parse(atob(token.split('.')[1]));
    }
  }

  // Salvar os dados da empresa na API
  saveEmpresa(empresaForm: any): void {
    empresaForm.onSubmit(null);
    if (empresaForm.invalid) {
      console.log("EMPRESA FORM:", empresaForm);
      return;
    }
    this.empresaService.criarEmpresa(this.form)
      .pipe(
        switchMap((response) => {
          console.log('Empresa criada com sucesso:', response);

          const token = sessionStorage.getItem('authToken');
          if (!token) {
            throw new Error('Token de autenticação não encontrado.');
          }

          this.updateRoleUser.name = this.payload.unique_name;
          this.updateRoleUser.email = this.payload.email;
          this.updateRoleUser.role = 'Admin';

          return this.authService.updateRole(this.updateRoleUser);
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Role do usuário atualizada:', response);
          alert('Configuração completa! Role atualizada para Admin.');

          // Atualiza o token no sessionStorage
          sessionStorage.setItem('authToken', response.token);
          this.getToken();
          this.userRole = this.payload.role;

          this.modalService.close();
          this.roleService.updateRole(this.userRole);
          this.getEmpresa(this.payload.idEmpresa);
          this.router.navigate(['dashboard']);
        },
        error: (err) => {
          console.error('Erro durante o processo:', err);
          alert('Ocorreu um erro ao finalizar a configuração. Por favor, tente novamente.');
        }
      });
  }

  setEmail() : void {
    this.form.email = this.payload.email;
  }

  getEndereco(): void {
    this.enderecoService.getEnderecoByCep(this.form.cep).subscribe({
      next: (response) => {
        console.log('ENDEREÇO: ', response);

        this.form.cep = response.cep;
        this.form.logradouro = response.logradouro.split(" ")[0];
        this.form.endereco = response.logradouro;
        this.form.bairro = response.bairro;
        this.form.cidade = response.localidade;
        this.form.estado = response.uf;
        this.form.complemento = response.complemento;

      },
      error: (err) => {
        console.error('Erro ao consultar endereço:', err);
        alert('Erro ao consultar endereço.');
      }
    });
  }

  getEmpresa(id: any): void {
    this.empresaService.getEmpresa(id).subscribe({
      next: (response) => {
        console.log('EMPRESA: ', response.response.data);
        // Simula o carregamento de dados do backend
        this.empresaData = {
          NomeEmpresa: response.response.data.nomeEmpresa,
          CNPJ: response.response.data.cnpj,
          NomeAdministradorEmpresa: response.response.data.nomeAdministradorEmpresa,
          CPF: response.response.data.cpf,
          Email: response.response.data.email,
          Celular: response.response.data.celular,
          CEP: response.response.data.cep,
          Endereco: response.response.data.endereco,
          Cidade: response.response.data.cidade,
          Estado: response.response.data.estado
        };
      },
      error: (err) => {
        console.error('Erro ao recuperar empresa:', err);
        alert('Erro ao recuperar empresa.');
      }
    });
  }
}
