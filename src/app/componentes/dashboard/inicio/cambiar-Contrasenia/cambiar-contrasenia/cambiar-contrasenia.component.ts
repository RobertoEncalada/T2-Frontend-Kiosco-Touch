import { PuenteDatosService } from 'src/app/servicios/comunicacio_componentes/puente-datos.service';
import { SnackbarService } from './../../../../../servicios/snackbar/snackbar.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/servicios/user/user.service';
import { ConfirmDialogService } from 'src/app/servicios/confirm-dialog/confirm-dialog.service';
import { MensajesErrorComponent } from '../../../mensajes-error/mensajes-error.component';

@Component({
  selector: 'app-cambiar-contrasenia',
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.css']
})
export class CambiarContraseniaComponent implements OnInit {

  ocultar = true;
  ocultar2 = true;
  ocultar3 = true;

  form: FormGroup;
  mensaje_error_lista: string[] = [];

  constructor(
    private api: ApiService, 
    private router: Router, 
    private fb: FormBuilder, 
    public dialog: MatDialog,
    private snackBar: SnackbarService ,
    private dialogService: ConfirmDialogService,
    private StaticData: PuenteDatosService
  ) { 
    this.form = this.fb.group({
      old_password: ['', Validators.required],
      new_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirm_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    })
  }

  ngOnInit(): void {
    this.StaticData.setMenuGeneral();
  }
  regresarInicio(){
    this.router.navigate(['/dashboard/juego/seleccion']);
  }
  mensajes_errores(mensajes: string[]){
    const dialogref = this.dialog.open(MensajesErrorComponent,{
      width:'50%',
      data: mensajes
    });
  }
  cambiarContrasenia(){
    if(this.form.valid){
      let id_usuario = Number(sessionStorage.getItem('user_id'));
      let formData: FormData = new FormData();
      formData.append('old_password', this.form.get('old_password')?.value);
      formData.append('new_password', this.form.get('new_password')?.value);
      formData.append('confirm_password', this.form.get('confirm_password')?.value);

      const options = {
        title: 'CAMBIAR CONTRASEÑA',
        message: 'ESTA SEGURO QUE QUIERE CAMBIAR SU CONTRASEÑA?',
        cancelText: 'CANCELAR',
        confirmText: 'CONFIRMAR'
      };
      this.dialogService.open(options);
      this.dialogService.confirmed().subscribe(confirmed => {
        this.api.postCambiarContraseña(id_usuario, formData).subscribe(
          res => {
            this.snackBar.mensaje('Contraseña cambiada correctamente');
            this.router.navigate(['/dashboard']);
          },
          err => {
            for(let message in err.error){
              this.mensaje_error_lista.push(err.error[message])
            }
            this.mensajes_errores(this.mensaje_error_lista)
            this.mensaje_error_lista=[];
          }
        );
      });

    }else{
      this.snackBar.mensaje('Por favor, complete todos los campos');
    }
  }
}
