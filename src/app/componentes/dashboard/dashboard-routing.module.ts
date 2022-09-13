import { EditarUsuariosComponent } from './usuarios/editar-usuarios/editar-usuarios.component';
import { InicioComponent } from './inicio/inicio.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CrearUsuariosComponent } from './usuarios/crear-usuarios/crear-usuarios.component';
import { VisualizarUsuariosComponent } from './usuarios/visualizar-usuarios/visualizar-usuarios.component';

const routes: Routes = [
  {path: '', component: DashboardComponent, children: [
    {path: '', component: InicioComponent},
    {path: 'usuarios', component: UsuariosComponent},
    {path: 'usuarios/crear', component: CrearUsuariosComponent},
    {path: 'usuarios/editar/:id', component: EditarUsuariosComponent},
    {path: 'usuarios/visualizar/:id', component: VisualizarUsuariosComponent},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
