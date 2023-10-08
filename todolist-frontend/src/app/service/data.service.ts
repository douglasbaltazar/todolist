import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { TaskVM } from '../view-model/TaskVM';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseUrl = "http://ec2-18-229-142-45.sa-east-1.compute.amazonaws.com:8081/api/v1/tasks"
  constructor(private http: HttpClient) { }

  getAllTasks(): Observable<TaskVM[]> {
    return this.http.get<TaskVM[]>(this.baseUrl);
  }

  createNewTask(task: TaskVM): Observable<TaskVM> {
    return this.http.post<TaskVM>(this.baseUrl, task);
  }

  removeTask(task: TaskVM): Observable<any> {
    return this.http.delete<any>(this.baseUrl + `/${task.id}`);
  }

  updateTask(task: TaskVM, id: string): Observable<TaskVM> {
    return this.http.put<TaskVM>(this.baseUrl + `/${id}`, task);
  }

  updateSequence(tasks: TaskVM[]): Observable<TaskVM[]> {
    return this.http.put<TaskVM[]>(this.baseUrl + `/sequence`, tasks);
  }
}
