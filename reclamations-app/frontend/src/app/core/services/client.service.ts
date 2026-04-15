import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client } from '../models';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private url = `${environment.apiUrl}/clients`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Client[]> { return this.http.get<Client[]>(this.url); }
  getById(id: number): Observable<Client> { return this.http.get<Client>(`${this.url}/${id}`); }
  getByEmail(email: string): Observable<Client> { return this.http.get<Client>(`${this.url}/email/${email}`); }
  create(c: Client): Observable<Client> { return this.http.post<Client>(this.url, c); }
  update(id: number, c: Client): Observable<Client> { return this.http.put<Client>(`${this.url}/${id}`, c); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
