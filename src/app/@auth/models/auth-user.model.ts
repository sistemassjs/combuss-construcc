export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role?: string | null;
  rol_id?: number | null;
  empresa_id?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  message?: string;
  token: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
