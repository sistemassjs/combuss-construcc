/**
 * Fachada de compatibilidad: reexporta AuthService de @auth.
 * Los imports `from 'src/app/services/auth.service'` siguen funcionando.
 */
export { AuthService } from '../@auth/services/auth.service';
export type { AuthUser } from '../@auth/models/auth-user.model';
