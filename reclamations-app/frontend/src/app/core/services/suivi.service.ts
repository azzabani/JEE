import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SuiviReclamation } from '../models';

@Injectable({ providedIn: 'root' })
export class SuiviService {
  private url = `${environment.apiUrl}/suivis`;
  constructor(private http: HttpClient) {}

  getByReclamation(id: number): Observable<SuiviReclamation[]> {
    return this.http.get<SuiviReclamation[]>(`${this.url}/reclamation/${id}`);
  }
  create(s: SuiviReclamation): Observable<SuiviReclamation> { return this.http.post<SuiviReclamation>(this.url, s); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
