import { PuenteDatosService } from './../../../servicios/comunicacio_componentes/puente-datos.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Ticket } from 'src/app/interfaces/ticket/Ticket';
import { TicketService } from 'src/app/servicios/ticket/ticket.service';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { PermisosService } from 'src/app/servicios/permisos/permisos.service';
import { SnackbarService } from 'src/app/servicios/snackbar/snackbar.service';
import { ConfirmDialogService } from 'src/app/servicios/confirm-dialog/confirm-dialog.service';
import { FormGroup, FormControl } from '@angular/forms';
import { GameDateService } from 'src/app/servicios/game-date/game-date.service';
import { DashboardStyleService } from 'src/app/servicios/theme/dashboardStyle/dashboard-style.service';
import { ViewTicketComponent } from './view-ticket/view-ticket.component';
@Component({
  selector: 'app-tickets',
  styleUrls: ['./tickets.component.css'],
  templateUrl: './tickets.component.html',
})
export class TicketsComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  Filters = [
    { id: '?state=Disponible', name: 'Tickets Disponibles' },
    { id: '?state=Reclamado', name: 'Tickets Reclamados' },
    { id: '?ordering=-date_created', name: 'Ultimos Tickets Creados' },
    { id: '?ordering=date_created', name: 'Primeros Tickets Creados' },
  ]

  
  filter_default = '?ordering=-date_created'

  singularName: string = 'ticket';
  pluralName: string = 'tickets';

  actionName: string = 'eliminar';
  permissions: any = [];

  total_tickets: number = 0

  displayedColumns: string[] = [
    'id',
    'invoice_number',
    'qr_code_digits',
    'client',
    'date_created',
    'state',
    'actions',
  ]
  dataSource !: MatTableDataSource<Ticket>;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild(ViewTicketComponent) viewTicket !: ViewTicketComponent;

  constructor(
    // Atributes of the user component
    private router: Router,
    private ticketAPI: TicketService,
    private permissionsAPI: PermisosService,
    private confirmDialog: ConfirmDialogService,
    private snackBar: SnackbarService,
    private statickData: PuenteDatosService,
    private gameDataSrv: GameDateService,
    private style: DashboardStyleService,
  ) { }

  

  ngOnInit(): void {
    this.loadAll(this.filter_default);
    
  }

  loadAll(filter: string) {
    this.statickData.setMenuGeneral();
    this.ticketAPI.getFilter(filter).subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.total_tickets = data.length
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  view(id: number) {
    this.router.navigate(['/dashboard/' + this.pluralName + '/vizualizar/' + id]);
  }

  edit(id: number) {
    this.router.navigate(['/dashboard/' + this.pluralName + '/editar/' + id]);
  }

  async delete(id: number) {
    this.permissions = await this.Permisos('Eliminar Ticket');
    if (this.permissions.length > 0) {
      this.showDeleteDialog();
      this.confirmDialog.confirmed().subscribe(confirmed => {
        if (confirmed) {
          this.ticketAPI.delete(id).subscribe(
            (data) => {
              this.snackBar.mensaje(this.singularName + ' eliminado exitosamente');
              this.loadAll(this.filter_default);
            },
            err => {
              this.confirmDialog.error(err.error)
            }
          )
        }
      })
    }
    else {
      this.snackBar.mensaje("No tienes permiso para Eliminar " + this.singularName);
    }
  }

 

  


  async print(id: number) {
    let promise = await this.Permisos('Imprimir Ticket')
    if (promise.length > 0) {
      this.viewTicket.printTicket();
    } else {
      this.snackBar.mensaje('No tienes permisos para Imprimir Ticket');
    }
  }

  showDeleteDialog() {
    const DIALOGINFO = {
      title: this.actionName.toUpperCase() + ' ' + this.singularName.toUpperCase(),
      message: '¿Está seguro de que desea eliminar el ' + this.singularName + ' ?',
      cancelText: 'CANCELAR',
      confirmText: this.actionName.toUpperCase()
    };

    this.confirmDialog.open(DIALOGINFO);

  }

  // async canDelete() {
  //   let rolId = Number(sessionStorage.getItem('rol_id'));
  //   let permiso = await lastValueFrom(this.permissionsAPI.getPermisosbyName('Eliminar Ticket'));
  //   let permissionId = Number(permiso[0].id);
  //   const promise = await lastValueFrom(this.permissionsAPI.getPermisosbyRolandPermission(rolId, permissionId));
  //   this.permissions = promise;
  // }

  async Permisos(name: string) {
    let rolId = Number(sessionStorage.getItem('rol_id'));
    let permiso = await lastValueFrom(this.permissionsAPI.getPermisosbyName(name));
    let permissionId = Number(permiso[0].id);
    const promise = await lastValueFrom(this.permissionsAPI.getPermisosbyRolandPermission(rolId, permissionId));
    return promise;
  }

  toCreation() {
    this.router.navigate(['dashboard/' + this.pluralName + '/crear']);
  }

  toList() {
    this.router.navigate(['dashboard/' + this.pluralName]);
  }

  filter(filter: string) {
    this.loadAll(filter);
  }
  toTicketConfiguration() {
    this.router.navigate(['dashboard/tickets/configuracion']);
  }
  date_filter() {
    if (this.range.value.start || this.range.value.end) {
      let start: any = this.range.get('start')?.value;
      let end: any = this.range.get('end')?.value;
      let start_date = this.gameDataSrv.DateFormat(start).split('T')[0];
      let end_date = this.gameDataSrv.DateFormat(end).split('T')[0];
      let filter = '?date_created__date__range=' + start_date + '%2C' + end_date
      this.loadAll(filter);
    } else {
      this.loadAll(this.filter_default);
    }
  }
  date_filter2() {
    this.range.get('start')?.setValue(null);
    this.range.get('end')?.setValue(null);
    this.loadAll(this.filter_default);
  }
}
