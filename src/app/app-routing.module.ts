import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './@auth/guards/auth.guard';
import { NoAuthGuard } from './@auth/guards/no-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'equipos',
    pathMatch: 'full',
  },
  {
    path: 'folder/:id',
    loadChildren: () =>
      import('./folder/folder.module').then((m) => m.FolderPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'equipos',
    loadChildren: () =>
      import('./pages/catalogos/equipos/equipos.module').then(
        (m) => m.EquiposPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/auth/login/login.module').then((m) => m.LoginPageModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'cargas',
    loadChildren: () =>
      import('./pages/cargas/cargas.module').then((m) => m.CargasPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'nueva-carga',
    loadChildren: () =>
      import('./pages/nueva-carga/nueva-carga.module').then(
        (m) => m.NuevaCargaPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./pages/users/users.module').then((m) => m.UsersPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'rendimiento',
    loadChildren: () =>
      import('./pages/rendimiento/rendimiento.module').then(
        (m) => m.RendimientoPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'operadores',
    loadChildren: () =>
      import('./pages/operadores/operadores.module').then(
        (m) => m.OperadoresPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'equipos',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
