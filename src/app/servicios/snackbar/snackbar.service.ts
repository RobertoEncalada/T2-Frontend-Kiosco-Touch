import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar,) { }


  mensaje(mensaje: string){
    this.snackBar.open(mensaje, '', {
      duration: 2500,
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    })
  }
}
