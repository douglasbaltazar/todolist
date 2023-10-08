import { Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { TaskVM } from 'src/app/view-model/TaskVM';
import { DialogRegisterNewTask } from '../dialog-register-new-task/dialog-register-new-task';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/service/data.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { DialogConfirmDelete } from '../dialog-confirm-delete/dialog-confirm-delete';

@Component({
  selector: 'app-table-tasks',
  templateUrl: './table-tasks.component.html',
  styleUrls: ['./table-tasks.component.css']
})
export class TableTasksComponent {
  tasks: TaskVM[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(public dialog: MatDialog, private dataService: DataService, private _snackBar: MatSnackBar) {

  }
  @ViewChild('table', { static: true }) table?: MatTable<TaskVM>;
  ngOnInit() {
    this.getAllTasks();
  }
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
  openDialogEditTask(enterAnimationDuration: string, exitAnimationDuration: string, obj: TaskVM): void {
    this.dialog.open(DialogRegisterNewTask, {
      width: '380px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        task: obj,
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

  getAllTasks(): void {
    this.dataService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      }, 
      error: (error) => {
        this.openSnackBar(error.error);
      }
    })
  }
  drop(event: CdkDragDrop<TaskVM[]>) {
    this.dragDisabled = true;
    event.item.data.sequence = event.currentIndex + 1;
    const previousIndex = this.tasks.findIndex((d) => d === event.item.data);
    moveItemInArray(this.tasks, previousIndex, event.currentIndex);
    this.tasks = this.tasks.map((task, index) => {
      task.sequence = index + 1;
      return task;
    });
    this.dataService.updateSequence(this.tasks).subscribe({
      next: (res) => {
        this.openSnackBar("Ordem de prioridade alterada.")
      },
      error: () => {
        this.openSnackBar("Erro")
      }
    });
    this.table?.renderRows();

  }

  formatarData(dataString: string): string {
    const data = new Date(dataString);
    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0"); // O mês começa em 0
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  displayedColumns: string[] = ['id', 'name', 'value', 'limitDate', 'actions'];

  
}
