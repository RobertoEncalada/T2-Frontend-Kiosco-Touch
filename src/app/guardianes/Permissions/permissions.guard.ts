import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';
import { PermisosService } from 'src/app/servicios/permisos/permisos.service';
import { SnackbarService } from 'src/app/servicios/snackbar/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuard implements CanActivate {
  constructor(
    private permisos_api : PermisosService,
    private snackbar : SnackbarService,
  ) { }


  async canActivate(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
  ): Promise<boolean> {

    let Permiso_nombre = route.data['Permiso_nombre'];

    const permiso = await lastValueFrom(this.permisos_api.getPermisosbyName(Permiso_nombre));

    let Permiso_id = Number(permiso[0].id);
    
    let rol = Number(sessionStorage.getItem('rol_id'));
    const promesa =  await lastValueFrom(this.permisos_api.getPermisosbyRolandPermission(rol, Permiso_id));
    if (promesa.length > 0) {
      return true;

    } else {
      this.snackbar.mensaje('No tienes permiso para: ' + Permiso_nombre);
      return false;
    }
  }
}
