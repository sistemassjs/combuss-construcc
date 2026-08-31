import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from '../services/session.service';

/**
 * Si una petición autenticada recibe 401, cierra la sesión local
 * (equivalente simplificado al HttpErrorInterceptor de GestionPlus).
 */
@Injectable()
export class SessionExpiredInterceptor implements HttpInterceptor {
  private readonly session = inject(SessionService);
  private handling = false;

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (this.shouldEndSession(req, error) && !this.handling) {
          this.handling = true;
          this.session.endSession();
          this.handling = false;
        }
        return throwError(() => error);
      })
    );
  }

  private shouldEndSession(
    req: HttpRequest<unknown>,
    error: HttpErrorResponse
  ): boolean {
    if (error.status !== 401) {
      return false;
    }
    if (!req.headers.has('Authorization')) {
      return false;
    }
    const api = (environment.apiUrl || '').replace(/\/$/, '');
    let path = req.url;
    if (api && path.startsWith(api)) {
      path = path.slice(api.length);
    }
    path = path.replace(/^\//, '').split('?')[0];
    if (path === 'login' || path.startsWith('login/')) {
      return false;
    }
    return true;
  }
}
