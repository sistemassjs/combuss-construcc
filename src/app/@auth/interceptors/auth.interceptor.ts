import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserStoreService } from '../services/user-store.service';

/** Segmentos de path relativos a apiUrl que no llevan Bearer. */
const SKIP_AUTH_PATHS = ['login', 'register', 'install', 'ping', 'status'];

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly userStore: UserStoreService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.isApiRequest(req.url)) {
      return next.handle(req);
    }

    if (this.shouldSkipAuth(req.url)) {
      return next.handle(req);
    }

    return this.userStore.token$.pipe(
      take(1),
      switchMap((token) => {
        if (!token || req.headers.has('Authorization')) {
          return next.handle(req);
        }
        return next.handle(
          req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          })
        );
      })
    );
  }

  private isApiRequest(url: string): boolean {
    const api = (environment.apiUrl || '').replace(/\/$/, '');
    const host = (environment.apiHost || '').replace(/\/$/, '');
    return (
      (!!api && url.startsWith(api)) ||
      (!!host && url.startsWith(host)) ||
      url.includes('/motiv/api')
    );
  }

  private shouldSkipAuth(url: string): boolean {
    const api = (environment.apiUrl || '').replace(/\/$/, '');
    let path = url;
    if (api && path.startsWith(api)) {
      path = path.slice(api.length);
    }
    path = path.replace(/^\//, '');
    if (path.includes('?')) {
      path = path.split('?')[0];
    }
    return SKIP_AUTH_PATHS.some(
      (segment) => path === segment || path.startsWith(`${segment}/`)
    );
  }
}
