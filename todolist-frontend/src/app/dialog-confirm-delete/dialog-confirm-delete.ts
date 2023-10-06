import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'dialog-confirm-delete',
  styleUrls: ['dialog-confirm-delete.css'],
  templateUrl: 'dialog-confirm-delete.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
})
export class DialogConfirmDelete {
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {}
  obj: Object = this.data;
  ngOnInit() {
    console.log(this.data);
  }
}
