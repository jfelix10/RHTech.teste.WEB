import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoleService } from '../services/role.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userRole = 'Pendinghh';
  closeOpenSideBar = 'closeSideBar';
  mainCloseOpen = 'mainClose';
  btnCloseOpen = 'btn btn-dark btn-tab btn-tab-close';
  seta = '>>';


  constructor(private roleService: RoleService) {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      this.userRole = JSON.parse(atob(token.split('.')[1])).role;
    }
  }
  
  ngOnInit(): void {
    this.roleService.currentRole.subscribe((role) => {
      // Atualiza o valor da role
      this.userRole = role; 
      console.log('Role atualizada no Dashboard:', role);
    });
  }

  openCloseNav() {
    if(this.closeOpenSideBar == 'closeSideBar')
    {
      this.closeOpenSideBar = 'openSideBar';
      this.mainCloseOpen = 'mainOpen';
      this.btnCloseOpen = 'btn btn-dark btn-tab btn-tab-open';
      this.seta = '<<';
    }
    else 
    {
      this.closeOpenSideBar = 'closeSideBar';
      this.mainCloseOpen = 'mainClose';
      this.btnCloseOpen = 'btn btn-dark btn-tab btn-tab-close';
      this.seta = '>>';
    }
  }

}
