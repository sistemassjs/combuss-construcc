import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { AuthService } from './@auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    { title: 'Equipos', url: '/equipos', icon: 'construct' },
    { title: 'Cargas', url: '/cargas', icon: 'receipt' },
  ];
  public labels: string[] = [];

  isAuthRoute = false;
  private readonly authRoutes = ['/login', '/register', '/auth/forgot'];

  constructor(
    private readonly router: Router,
    private readonly menu: MenuController,
    private readonly auth: AuthService,
    private readonly platform: Platform
  ) {
    this.auth.isLoggedIn$().subscribe((logged) => {
      const currentUrl = this.router.url;
      const isAuth = this.authRoutes.some((p) => currentUrl.startsWith(p));
      const showMenu = logged && !isAuth;
      this.isAuthRoute = !showMenu;
      void this.menu.enable(showMenu);
    });

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = e.urlAfterRedirects || e.url;
        const isAuth = this.authRoutes.some((p) => url.startsWith(p));
        this.isAuthRoute = isAuth;
        void this.menu.enable(!isAuth && this.auth.loggedIn$.value);
      });
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        void this.menu.close();
      },
      error: () => {
        void this.menu.close();
      },
    });
  }

  get isDesktop(): boolean {
    return this.platform.is('desktop');
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }
}
