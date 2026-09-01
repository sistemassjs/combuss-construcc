import { Injectable } from '@angular/core';
import { AuthUser } from '../models/auth-user.model';

/** Clave histórica de MOTIV (no inventar otra). */
const USER_KEY = 'user';
/** Residuo de la migración @auth; se limpia al leer/escribir/cerrar sesión. */
const OBSOLETE_USER_KEY = 'motiv_auth_user';

@Injectable({ providedIn: 'root' })
export class UserLocalStorageService {
  getUser(): AuthUser | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const raw =
      localStorage.getItem(USER_KEY) ?? localStorage.getItem(OBSOLETE_USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      const user = JSON.parse(raw) as AuthUser;
      localStorage.setItem(USER_KEY, raw);
      localStorage.removeItem(OBSOLETE_USER_KEY);
      return user;
    } catch {
      return null;
    }
  }

  setUser(user: AuthUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.removeItem(OBSOLETE_USER_KEY);
  }

  removeUser(): void {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(OBSOLETE_USER_KEY);
  }
}
