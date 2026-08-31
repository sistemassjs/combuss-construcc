# Guía de agentes — combuss-construcc

PWA Ionic/Angular de **MOTIV** (campo: equipos, cargas, operadores, rendimiento).

## Contexto operativo

Vive **solo** en el backend: `api-motiv/docs/context/` (empezar por `README.md`).

Este repo **no** documenta dominio de negocio. Auth/sesión/roles: ver `api-motiv/docs/context/platform-auth.md` y `platform-users-roles.md`.

Diagnóstico histórico solo lectura: `wk-motiv/docs-motiv/`.

## Stack

Ionic 8 · Angular (NgModules) · TypeScript · PWA

## Sesión (`src/app/@auth/`)

Patrón GestionPlus **sin** contexto proveedor: `TokenService`, `UserStoreService`, `SessionService`, `AuthGuard`, `NoAuthGuard`, `AuthInterceptor`, `SessionExpiredInterceptor`.

Home con sesión: `/equipos`. Login: `/login` (`NoAuthGuard`).

## Reglas Cursor (`.cursor/rules/`)

| Archivo | Notas |
|---------|--------|
| `00-general.mdc` | Siempre |
| `front-auth.mdc` | Sesión / `@auth` |
| `front-services.mdc` | HTTP / Bearer |

## API

Consumir `api-motiv` vía `environment.apiUrl`. No hardcodear hosts en servicios nuevos.

## Límites

- Cambios pequeños y localizados salvo pedido explícito.
- No modificar `api-motiv` desde una tarea “solo front” salvo que el usuario lo pida.
- No exigir `ng build` como verificación rutinaria.
- No copiar OAuth, FCM ni `ProveedorContext` de GestionPlus.
