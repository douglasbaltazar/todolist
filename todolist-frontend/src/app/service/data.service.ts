import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { TaskVM } from '../view-model/TaskVM';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseUrl = "http://localhost:8081/api/v1"
  constructor(private http: HttpClient) { }

  getAllTasks(): Observable<TaskVM[]> {
    return this.http.get<TaskVM[]>(this.baseUrl + "/todos");
  }

  createNewTask(task: TaskVM): Observable<TaskVM> {
    return this.http.post<TaskVM>(this.baseUrl + "/todos", task);
  }

  removeTask(task: TaskVM): Observable<any> {
    return this.http.delete<any>(this.baseUrl + `/todos/${task.id}`);
  }
}
