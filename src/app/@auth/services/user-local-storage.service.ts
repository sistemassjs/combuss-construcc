import { Injectable } from '@angular/core';
import { AuthUser } from '../models/auth-user.model';

const USER_KEY = 'motiv_auth_user';
const LEGACY_USER_KEY = 'user';

@Injectable({ providedIn: 'root' })
export class UserLocalStorageService {
  getUser(): AuthUser | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const raw =
      localStorage.getItem(USER_KEY) ?? localStorage.getItem(LEGACY_USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  setUser(user: AuthUser): void {
    const serialized = JSON.stringify(user);
    localStorage.setItem(USER_KEY, serialized);
    localStorage.setItem(LEGACY_USER_KEY, serialized);
  }

  removeUser(): void {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LEGACY_USER_KEY);
  }
}
