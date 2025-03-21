import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MinhaEmpresaComponent } from './minha-empresa/minha-empresa.component';
import { CargosComponent } from './cargos/cargos.component';
import { BeneficiosComponent } from './beneficios/beneficios.component';
import { TodosUsuariosComponent } from './todos-usuarios/todos-usuarios.component';

export const routes: Routes = [
    { path: "", component: LoginComponent },
    { 
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            { 
                path: 'minha-empresa', component: MinhaEmpresaComponent
            },
            { 
                path: 'cargos', component: CargosComponent
            },
            { 
                path: 'beneficios', component: BeneficiosComponent
            },{ 
                path: 'todos-usuarios', component: TodosUsuariosComponent
            },
            { path: '', redirectTo: 'minha-empresa', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: "" }
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
