import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmDelete } from './dialog-confirm-delete/dialog-confirm-delete';
import { CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { DialogRegisterNewTask } from './dialog-register-new-task/dialog-register-new-task';
import { DataService } from './service/data.service';
import { TaskVM } from './view-model/TaskVM';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tasks: TaskVM[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(public dialog: MatDialog, private dataService: DataService, private _snackBar: MatSnackBar) {

  }
  ngOnInit() {
    this.getAllTasks();
  }
  @ViewChild('table', { static: true }) table?: MatTable<TaskVM>;
  
  dragDisabled = true;
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, obj: TaskVM): void {
    this.dialog.open(DialogConfirmDelete, {
      width: '600px',
      height: '160px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        task: obj,
        handleState: this.getAllTasks.bind(this),
        handleSnackBar: this.openSnackBar.bind(this)
      }
    });
  }
  openDialogNewTask(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogRegisterNewTask, {
      width: '380px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        handleState: this.getAllTasks.bind(this),
        handleSnackBar: this.openSnackBar.bind(this)
      }
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000,
      panelClass: ['warning']
    });
  }

  public getAllTasks(): void {
    this.dataService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      }
    })
  }
  drop(event: CdkDragDrop<TaskVM[]>) {
    this.dragDisabled = true;

    const previousIndex = this.tasks.findIndex((d) => d === event.item.data);

    moveItemInArray(this.tasks, previousIndex, event.currentIndex);
    this.table?.renderRows();

  }

  formatarData(dataString: string): string {
    const data = new Date(dataString);
    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0"); // O mês começa em 0
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  
  title = 'ToDoList - FrontEnd';
  displayedColumns: string[] = ['id', 'name', 'value', 'limitDate', 'actions'];
}
