import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule }  from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';



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
  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('pt-BR')
  }
  
  newTaskForm = this.formBuilder.group({
    name: ['', Validators.required],
    value: ['', [Validators.required, Validators.min(0)]],
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
    // if (control.hasError('numeric')) {
    //   return `O valor no campo ${controlName} deve ser numérico`;
    // }
    return '';
  }

  numericValidator(control: FormControl) {
    const value = control.value;
    if (isNaN(value)) {
      return { numeric: true };
    }
    return null;
  }
  saveForm() {
    console.log('Dados', this.newTaskForm.value);
  }
}
