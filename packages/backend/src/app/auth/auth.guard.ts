import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

/**
 * Route guard that ensures the user is authenticated.
 * If the user is not authenticated, initiates the OIDC login flow.
 * 
 * Usage: Include in route configuration with the `canActivate` property:
 * ```typescript
 * {
 *   path: 'protected',
 *   component: ProtectedComponent,
 *   canActivate: [authGuard]
 * }
 * ```
 */
export const authGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }

      // Initiate login flow without preserving state (router will handle navigation)
      authService.authenticate(false).subscribe();
      return false;
    })
  );
};
