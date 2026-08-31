import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUser } from '../models/auth-user.model';
import { TokenService } from './token.service';
import { UserLocalStorageService } from './user-local-storage.service';

/**
 * Estado de sesión en memoria, hidratado desde storage al arrancar
 * (mismo patrón que GestionPlus UserStoreService).
 */
@Injectable({ providedIn: 'root' })
export class UserStoreService {
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(
    this.userStorage.getUser()
  );
  private readonly tokenSubject = new BehaviorSubject<string | null>(
    this.tokenService.getToken()
  );

  readonly user$: Observable<AuthUser | null> = this.userSubject.asObservable();
  readonly token$: Observable<string | null> = this.tokenSubject.asObservable();

  constructor(
    private readonly tokenService: TokenService,
    private readonly userStorage: UserLocalStorageService
  ) {}

  setUser(user: AuthUser): void {
    this.userStorage.setUser(user);
    this.userSubject.next(user);
  }

  setToken(token: string): void {
    this.tokenService.setToken(token);
    this.tokenSubject.next(token);
  }

  clear(): void {
    this.userStorage.removeUser();
    this.tokenService.removeToken();
    this.userSubject.next(null);
    this.tokenSubject.next(null);
  }

  get userSnapshot(): AuthUser | null {
    return this.userSubject.value;
  }

  get tokenSnapshot(): string | null {
    return this.tokenSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }
}
