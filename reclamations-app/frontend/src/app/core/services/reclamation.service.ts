import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Reclamation, RapportSatisfaction, StatutReclamation } from '../models';

@Injectable({ providedIn: 'root' })
export class ReclamationService {
  private url = `${environment.apiUrl}/reclamations`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Reclamation[]> { return this.http.get<Reclamation[]>(this.url); }
  getById(id: number): Observable<Reclamation> { return this.http.get<Reclamation>(`${this.url}/${id}`); }
  getByClient(clientId: number): Observable<Reclamation[]> { return this.http.get<Reclamation[]>(`${this.url}/client/${clientId}`); }
  getByAgent(agentId: number): Observable<Reclamation[]> { return this.http.get<Reclamation[]>(`${this.url}/agent/${agentId}`); }
  getByStatut(statut: StatutReclamation): Observable<Reclamation[]> { return this.http.get<Reclamation[]>(`${this.url}/statut/${statut}`); }
  create(r: Reclamation): Observable<Reclamation> { return this.http.post<Reclamation>(this.url, r); }
  update(id: number, r: Reclamation): Observable<Reclamation> { return this.http.put<Reclamation>(`${this.url}/${id}`, r); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
  affecter(reclamationId: number, agentId: number): Observable<Reclamation> {
    return this.http.patch<Reclamation>(`${this.url}/${reclamationId}/affecter/${agentId}`, {});
  }
  changerStatut(id: number, statut: StatutReclamation): Observable<Reclamation> {
    return this.http.patch<Reclamation>(`${this.url}/${id}/statut/${statut}`, {});
  }
  getRapport(): Observable<RapportSatisfaction> { return this.http.get<RapportSatisfaction>(`${this.url}/rapport`); }
}
