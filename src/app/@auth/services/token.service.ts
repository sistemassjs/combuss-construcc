import { Injectable } from '@angular/core';

/** Clave histórica de MOTIV (no inventar otra). */
const TOKEN_KEY = 'token';
/** Residuo de la migración @auth; se limpia al leer/escribir/cerrar sesión. */
const OBSOLETE_TOKEN_KEY = 'motiv_auth_token';

@Injectable({ providedIn: 'root' })
export class TokenService {
  getToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      localStorage.removeItem(OBSOLETE_TOKEN_KEY);
      return token;
    }
    const obsolete = localStorage.getItem(OBSOLETE_TOKEN_KEY);
    if (obsolete) {
      localStorage.setItem(TOKEN_KEY, obsolete);
      localStorage.removeItem(OBSOLETE_TOKEN_KEY);
      return obsolete;
    }
    return null;
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(OBSOLETE_TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(OBSOLETE_TOKEN_KEY);
  }
}
