import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmDelete } from './dialog-confirm-delete/dialog-confirm-delete';
import { CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { DialogRegisterNewTask } from './dialog-register-new-task/dialog-register-new-task';
import { DataService } from './service/data.service';
import { TaskVM } from './view-model/TaskVM';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tasks: TaskVM[] = [];
  constructor(public dialog: MatDialog, private dataService: DataService) {

  }
  ngOnInit() {
    this.dataService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        console.log(this.tasks);
      }
    })
  }
  @ViewChild('table', { static: true }) table?: MatTable<TaskVM>;
  
  dragDisabled = true;
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, obj: TaskVM): void {
    this.dialog.open(DialogConfirmDelete, {
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        ...obj
      }
    });
  }
  openDialogNewTask(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogRegisterNewTask, {
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
  drop(event: CdkDragDrop<TaskVM[]>) {
    this.dragDisabled = true;

    const previousIndex = this.tasks.findIndex((d) => d === event.item.data);

    moveItemInArray(this.tasks, previousIndex, event.currentIndex);
    this.table?.renderRows();

  }
  title = 'ToDoList - FrontEnd';
  displayedColumns: string[] = ['id', 'name', 'value', 'limitDate', 'actions'];
}
