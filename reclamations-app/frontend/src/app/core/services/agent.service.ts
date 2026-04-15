import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AgentSAV } from '../models';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private url = `${environment.apiUrl}/agents`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<AgentSAV[]> { return this.http.get<AgentSAV[]>(this.url); }
  getById(id: number): Observable<AgentSAV> { return this.http.get<AgentSAV>(`${this.url}/${id}`); }
  create(a: AgentSAV): Observable<AgentSAV> { return this.http.post<AgentSAV>(this.url, a); }
  update(id: number, a: AgentSAV): Observable<AgentSAV> { return this.http.put<AgentSAV>(`${this.url}/${id}`, a); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
