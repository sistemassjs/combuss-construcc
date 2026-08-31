import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { map, Observable, take } from 'rxjs';
import { AuthUser } from '../models/auth-user.model';
import { UserStoreService } from './user-store.service';

/** Home por defecto de la PWA de campo MOTIV (sin dashboards por rol GestionPlus). */
export const MOTIV_HOME_ROUTE = '/equipos';
export const MOTIV_LOGIN_ROUTE = '/login';

/**
 * Orquesta inicio/cierre de sesión. Sin contexto proveedor (excluido a propósito).
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  constructor(
    private readonly userStore: UserStoreService,
    private readonly navCtrl: NavController
  ) {}

  startSession(
    token: string,
    user: AuthUser,
    navigateToHome: boolean = true
  ): void {
    this.userStore.setToken(token);
    this.userStore.setUser(user);

    if (navigateToHome) {
      void this.navigateToHome();
    }
  }

  endSession(): void {
    this.userStore.clear();
    void this.navCtrl.navigateRoot(MOTIV_LOGIN_ROUTE);
  }

  /** Limpia store/storage sin navegar (p. ej. antes de un redirect manual). */
  clearAuthOnly(): void {
    this.userStore.clear();
  }

  async navigateToHome(): Promise<boolean> {
    return new Promise((resolve) => {
      this.userStore.token$.pipe(take(1)).subscribe((token) => {
        if (token) {
          void this.navCtrl.navigateRoot(MOTIV_HOME_ROUTE);
          resolve(true);
        } else {
          void this.navCtrl.navigateRoot(MOTIV_LOGIN_ROUTE);
          resolve(false);
        }
      });
    });
  }

  getHomeRoute(): Observable<string> {
    return this.userStore.token$.pipe(
      map((token) => (token ? MOTIV_HOME_ROUTE : MOTIV_LOGIN_ROUTE))
    );
  }
}
