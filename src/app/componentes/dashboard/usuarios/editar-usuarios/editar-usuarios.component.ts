import { Usuarios } from '../../../../interfaces/usuarios/usuarios';
import { ApiService } from '../../../../servicios/usuarios/api.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Roles } from 'src/app/interfaces/roles/roles';
import { ConfirmDialogService } from 'src/app/servicios/confirm-dialog/confirm-dialog.service';
import { SnackbarService } from 'src/app/servicios/snackbar/snackbar.service';

@Component({
  selector: 'app-editar-usuarios',
  templateUrl: './editar-usuarios.component.html',
  styleUrls: ['./editar-usuarios.component.css']
})
export class EditarUsuariosComponent implements OnInit {

  form: FormGroup;
  roles: Roles[] = [];
  id_rol: number = 0;
  usuarioget: Usuarios ={
    id: 0,
    cedula : '',
    names : '',
    surnames : '',
    username : '',
    email : '',
    phone : '',
    password : '',
    sex : '',
    address : '',
    rol : '',
    is_active : true,
    created : '',
    modified : '',
    last_session : ''
  }; 

  constructor(
    private api: ApiService ,
    private fb: FormBuilder, 
    private router: Router, 
    private activerouter: ActivatedRoute, 
    private snackBar: SnackbarService,
    private dialogService: ConfirmDialogService
    ) {

    this.form = this.fb.group({
      cedula: ['', Validators.required],
      username: ['', Validators.required],
      names: ['', Validators.required],
      surnames: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      sex: ['', Validators.required],
      address: ['', Validators.required],
      rol: ['', Validators.required],
      is_active: ['', Validators.required],
  })
   }

  ngOnInit(): void {
    
    let usuarioid = this.activerouter.snapshot.paramMap.get('id');
    this.cargarRoles();
    this.api.getUsuarioId(Number(usuarioid)).subscribe((data) => {
      this.usuarioget = data;
      this.form.controls['cedula'].setValue(this.usuarioget.cedula);
      this.form.controls['username'].setValue(this.usuarioget.username);
      this.form.controls['names'].setValue(this.usuarioget.names);
      this.form.controls['surnames'].setValue(this.usuarioget.surnames);
      this.form.controls['email'].setValue(this.usuarioget.email);
      this.form.controls['phone'].setValue(this.usuarioget.phone);
      this.form.controls['sex'].setValue(this.usuarioget.sex);
      this.form.controls['address'].setValue(this.usuarioget.address);
      this.api.getRolbyName(this.usuarioget.rol).subscribe(
        (data)=> { 
          this.form.controls['rol'].setValue(data[0].id.toString());
        })
      this.form.controls['is_active'].setValue(this.usuarioget.is_active.toString())
    });
  }

  regresarUsuarios(){
    this.router.navigate(['/dashboard/usuarios']);
  }


  cargarRoles(){
    this.api.getRoles().subscribe((data) => {
      this.roles = data;
    });
  }
  
  actualizarUsuario(){
    let usuarioid = this.activerouter.snapshot.paramMap.get('id');
    if (this.form.valid){
      const options = {
        title: 'EDITAR USUARIO',
        message: 'ESTA SEGURO QUE QUIERE ACTUALIZAR EL USUARIO?',
        cancelText: 'CANCELAR',
        confirmText: 'CONFIRMAR'
      };
      this.dialogService.open(options);
      this.dialogService.confirmed().subscribe(confirmed => {
        let formData: FormData = new FormData();
        formData.append('cedula', this.form.get('cedula')?.value);
        formData.append('username', this.form.get('username')?.value);
        formData.append('names', this.form.get('names')?.value);
        formData.append('surnames', this.form.get('surnames')?.value);
        formData.append('email', this.form.get('email')?.value);
        formData.append('phone', this.form.get('phone')?.value);
        formData.append('sex', this.form.get('sex')?.value);
        formData.append('address', this.form.get('address')?.value);
        formData.append('rol', this.form.get('rol')?.value);
        formData.append('is_active', this.form.get('is_active')?.value);

        this.api.putUsuario(Number(usuarioid), formData).subscribe(
          (data) => {
            this.snackBar.mensaje('Usuario Actualizado Exitosamente');
            this.router.navigate(['/dashboard/usuarios']);
          },
          (res) => {
            this.dialogService.error(res.error);
          }
        );
    }
    );

  }
}

}
