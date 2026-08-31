import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
} from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { SessionService } from '../services/session.service';
import { UserStoreService } from '../services/user-store.service';

/**
 * En rutas de login: si ya hay token, redirige al home (no muestra login).
 */
@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private readonly sessionService: SessionService,
    private readonly userStore: UserStoreService
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkSession();
  }

  canActivateChild(
    _childRoute: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkSession();
  }

  private checkSession(): Observable<boolean> {
    return this.userStore.token$.pipe(
      take(1),
      map((token) => {
        if (token) {
          void this.sessionService.navigateToHome();
          return false;
        }
        return true;
      })
    );
  }
}
