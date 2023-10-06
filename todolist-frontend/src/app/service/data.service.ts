import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiUrl = "http://localhost:8081/api/v1/todos"
  constructor(private http: HttpClient) { }
  getAllPosts(): Observable<Object[]> {
    return this.http.get<Object[]>(this.apiUrl);
  }
}
