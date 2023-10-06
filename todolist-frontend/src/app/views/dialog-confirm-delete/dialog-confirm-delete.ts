import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { DataService } from '../../service/data.service';
import { TaskVM } from '../../view-model/TaskVM';

@Component({
  selector: 'dialog-confirm-delete',
  styleUrls: ['dialog-confirm-delete.css'],
  templateUrl: 'dialog-confirm-delete.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
})
export class DialogConfirmDelete {
  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: { task: TaskVM, handleState: Function, handleSnackBar: Function }, private dataService: DataService) {}
  task: TaskVM = this.data.task;
  removeTask() {
    this.dataService.removeTask(this.task).subscribe({
      next: () => {
        this.data.handleState();
        this.data.handleSnackBar("Task removida com sucesso!!");
      },
      error: (error) => {
          this.data.handleSnackBar(error.error);
      }
    });
  }
}
