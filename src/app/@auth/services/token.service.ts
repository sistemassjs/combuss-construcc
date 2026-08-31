import { Injectable } from '@angular/core';

/** Clave nueva (GestionPlus-style). Se lee también la clave legado `token`. */
const TOKEN_KEY = 'motiv_auth_token';
const LEGACY_TOKEN_KEY = 'token';

@Injectable({ providedIn: 'root' })
export class TokenService {
  getToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return (
      localStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(LEGACY_TOKEN_KEY)
    );
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    // Compatibilidad temporal con servicios que aún leen `token`
    localStorage.setItem(LEGACY_TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
  }
}
