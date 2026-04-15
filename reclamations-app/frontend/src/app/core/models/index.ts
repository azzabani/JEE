export type StatutReclamation = 'OUVERTE' | 'EN_COURS' | 'RESOLUE' | 'FERMEE' | 'REJETEE';
export type Role = 'ROLE_CLIENT' | 'ROLE_AGENT' | 'ROLE_ADMIN';

export interface Client {
  id?: number;
  nom: string;
  email: string;
  telephone: string;
}

export interface AgentSAV {
  id?: number;
  nom: string;
  competence: string;
}

export interface Reclamation {
  id?: number;
  clientId: number;
  clientNom?: string;
  produit: string;
  statut?: StatutReclamation;
  description: string;
  date?: string;
  note?: number;
  agentId?: number;
  agentNom?: string;
}

export interface SuiviReclamation {
  id?: number;
  message: string;
  reclamationId: number;
  employe: string;
  action: string;
  date?: string;
}

export interface RapportSatisfaction {
  noteMoyenne: number;
  totalReclamations: number;
  reclamationsParStatut: Record<string, number>;
  reclamationsParProduit: Record<string, number>;
  reclamationsResolues: number;
  tauxResolution: number;
}

export interface LoginRequest { username: string; password: string; }
export interface RegisterRequest {
  username: string; password: string;
  nom: string; email: string; telephone: string; role?: Role;
}
export interface AuthResponse {
  token: string; username: string; nom: string; email: string; role: Role;
}
