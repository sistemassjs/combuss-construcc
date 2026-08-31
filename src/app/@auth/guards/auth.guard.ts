import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { MOTIV_LOGIN_ROUTE } from '../services/session.service';
import { UserStoreService } from '../services/user-store.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userStore: UserStoreService,
    private readonly router: Router
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.userStore.token$.pipe(
      take(1),
      map((token) =>
        token ? true : this.router.createUrlTree([MOTIV_LOGIN_ROUTE])
      )
    );
  }
}
