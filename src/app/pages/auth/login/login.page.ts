import { Component } from '@angular/core';
import { AuthService } from 'src/app/@auth/services/auth.service';
import { Router } from '@angular/router';
import { MOTIV_HOME_ROUTE } from 'src/app/@auth/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  doLogin() {
    this.error = '';
    this.loading = true;

    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.loading = false;
          void this.router.navigate([MOTIV_HOME_ROUTE], { replaceUrl: true });
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.error = 'Credenciales incorrectas';
        },
      });
  }
}
