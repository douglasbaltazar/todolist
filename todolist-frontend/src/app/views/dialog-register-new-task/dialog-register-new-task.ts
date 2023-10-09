import { Component } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule }  from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DataService } from '../../service/data.service';
import { Inject } from '@angular/core';
import { TaskVM } from 'src/app/view-model/TaskVM';


@Component({
  selector: 'dialog-register-new-task',
  styleUrls: ['dialog-register-new-task.css'],
  templateUrl: 'dialog-register-new-task.html',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatDialogModule, 
    MatInputModule, 
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    MatDatepickerModule
  ]
})
export class DialogRegisterNewTask {
  constructor(
    public dialog: MatDialog, 
    private formBuilder: FormBuilder, 
    private dateAdapter: DateAdapter<Date>, 
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: { handleState: Function, handleSnackBar: Function, task?: TaskVM },
    private dialogRef: MatDialogRef<DialogRegisterNewTask>
    ) {
    this.dateAdapter.setLocale('pt-BR')
  }
  ngOnInit() {
    if (this.data.task) {
      this.newTaskForm.patchValue({
        limitDate: this.data.task.limitDate,
        name: this.data.task.name,
        value: this.data.task.value.toString()
      });
    }
  }
  
  newTaskForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    value: ['', [Validators.required, Validators.min(0), Validators.max(1000000)]],
    limitDate: ['', Validators.required]
  });

  getErrorMessage(controlName: string): string {
    const control = this.newTaskForm.get(controlName) as FormControl;
    if (control.hasError('required')) {
      return `O campo ${controlName} é obrigatório`;
    }
    if (control.hasError('min')) {
      return `O menor valor possivel é 0.`;
    }
    if (control.hasError('max')) {
      return `O maior valor possivel é 1000000.`;
    }
    // if (control.hasError('numeric')) {
    //   return `O valor no campo ${controlName} deve ser numérico`;
    // }
    return '';
  }
  validateSelectedDate(selectedDate: Date): boolean {
    const currentDate = this.dateAdapter.today();
    return selectedDate >= currentDate;
  }
  validateDate = (date: Date | null): boolean => {
    if (!date) {
      return false; // Se não houver data selecionada, não permita a seleção
    }
    return this.validateSelectedDate(date);
  };
  async saveForm() {
    const task = {
      name: this.newTaskForm.value.name!,
      limitDate: this.newTaskForm.value.limitDate!,
      value: Number(this.newTaskForm.value.value)!
    }
    if (this.data.task) {
      console.log(this.data.task);
      await this.dataService.updateTask(task, this.data.task.id!).subscribe({
        next: () => {
          this.data.handleState();
          this.data.handleSnackBar("Task alterada com sucesso!!")
        }, error: (error) => {
          let erro = error.error.message == undefined ? error.error : error.error.message;
          this.data.handleSnackBar("Erro: " + erro);
        }
      })
    } else {
      await this.dataService.createNewTask(task).subscribe({
        next: () => {
            this.data.handleState();
            this.data.handleSnackBar("Task registrada com sucesso!!")
        },
        error: (error) => {
          this.data.handleSnackBar("Erro: " + error.error);
        }
      });
    }
    
    
  }
}
