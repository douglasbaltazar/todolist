import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmDelete } from './dialog-confirm-delete/dialog-confirm-delete';
import { CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem, CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { DialogRegisterNewTask } from './dialog-register-new-task/dialog-register-new-task';



export interface PeriodicElement {
  name: string;
  id: number;
  value: number;
  limitDate: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {id: 1, name: 'Hydrogen', value: 1000.0079, limitDate: 'H'},
  {id: 2, name: 'Helium', value: 4.0026, limitDate: 'He'},
  {id: 3, name: 'Lithium', value: 6.941, limitDate: 'Li'},
  {id: 4, name: 'Beryllium', value: 9.0122, limitDate: 'Be'},
  {id: 5, name: 'Boron', value: 10.811, limitDate: 'B'},
  {id: 6, name: 'Carbon', value: 12.0107, limitDate: 'C'},
  {id: 7, name: 'Nitrogen', value: 14.0067, limitDate: 'N'},
  {id: 8, name: 'Oxygen', value: 15.9994, limitDate: 'O'},
  {id: 9, name: 'Fluorine', value: 18.9984, limitDate: 'F'},
  {id: 10, name: 'Neon', value: 20.1797, limitDate: 'Ne'},
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(public dialog: MatDialog) {

  }
  @ViewChild('table', { static: true }) table?: MatTable<PeriodicElement>;
  
  dragDisabled = true;
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogConfirmDelete, {
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
  openDialogNewTask(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogRegisterNewTask, {
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
  drop(event: CdkDragDrop<PeriodicElement[]>) {
    this.dragDisabled = true;

    const previousIndex = this.dataSource.findIndex((d) => d === event.item.data);

    moveItemInArray(this.dataSource, previousIndex, event.currentIndex);
    this.table?.renderRows();

  }
  title = 'ToDoList - FrontEnd';
  displayedColumns: string[] = ['id', 'name', 'value', 'limitDate', 'actions'];
  dataSource = ELEMENT_DATA;
}
