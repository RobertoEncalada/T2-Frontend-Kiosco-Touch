import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-result-message',
  templateUrl: './result-message.component.html',
  styleUrls: ['./result-message.component.css']
})
export class ResultMessageComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ResultMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{
      title : string;
      image : string;
      result_music : string;
    }
  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }
  cerrar(){
    this.dialogRef.close();
  }
}
