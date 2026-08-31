import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from '../models/auth-user.model';
import { SessionService } from './session.service';
import { UserStoreService } from './user-store.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly zone = inject(NgZone);
  private readonly session = inject(SessionService);
  private readonly userStore = inject(UserStoreService);

  private readonly baseUrl =
    environment.apiUrl || 'https://api.rorisafe.com/motiv/api';

  /** Compatibilidad con app.component (menú). */
  readonly loggedIn$ = new BehaviorSubject<boolean>(
    this.userStore.isAuthenticated
  );

  constructor() {
    this.userStore.token$.subscribe((token) => {
      this.zone.run(() => this.loggedIn$.next(!!token));
    });
  }

  isLoggedIn$(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          this.session.startSession(response.token, response.user, false);
        })
      );
  }

  /**
   * Revoca token en API y cierra sesión local.
   * Si el logout remoto falla, igual limpia la sesión local.
   */
  logout(): Observable<unknown> {
    const headers = this.getAuthHeaders().headers;
    return this.http
      .post(`${this.baseUrl}/logout`, {}, { headers })
      .pipe(
        tap({
          next: () => this.session.endSession(),
          error: () => this.session.endSession(),
        }),
        catchError(() => {
          this.session.endSession();
          return of(null);
        })
      );
  }

  getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.userStore.tokenSnapshot;
    return {
      headers: new HttpHeaders(
        token
          ? { Authorization: `Bearer ${token}`, Accept: 'application/json' }
          : { Accept: 'application/json' }
      ),
    };
  }

  get currentUser(): AuthUser | null {
    return this.userStore.userSnapshot;
  }

  /** UI legacy: menú admin. Destino: permisos de /me. */
  isAdmin(): boolean {
    const user = this.currentUser;
    if (!user) {
      return false;
    }
    if (user.role === 'admin') {
      return true;
    }
    // Heurística temporal: rol_id 1 suele ser ADM en seeds MOTIV
    return user.role?.toLowerCase() === 'admin' || user.rol_id === 1;
  }
}
