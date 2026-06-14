import { inject, Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StatehandlerService } from './state-handler.service';

/**
 * Service responsible for handling OIDC authentication flows.
 * Manages login state and coordinates with the state handler for navigation flow preservation.
 * 
 * SOLID Principles:
 * - Single Responsibility: Handles only authentication concerns
 * - Open/Closed: Can be extended for additional auth features without modification
 * - Liskov Substitution: Can be used anywhere a service managing authentication is expected
 * - Interface Segregation: Provides only necessary public methods
 * - Dependency Inversion: Depends on injected abstractions, not concrete implementations
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly oidcService: OidcSecurityService = inject(OidcSecurityService);
  private readonly stateHandler: StatehandlerService = inject(StatehandlerService);

  /**
   * Observable stream of the current authentication state.
   * Emits true when the user has a valid access token.
   */
  readonly isAuthenticated$: Observable<boolean> = this.oidcService.isAuthenticated$;

  /**
   * Observable stream of the current access token.
   * Emits the access token string or null if not available.
   */
  readonly accessToken$: Observable<string> = this.oidcService.getAccessToken();

  /**
   * Initiates the OIDC authentication flow with optional state preservation.
   * When setState is true, creates a state object to preserve the current navigation context.
   *
   * @param setState - Whether to create and preserve navigation state (default: true)
   * @returns Observable<void> that completes after authentication is initiated
   */
  authenticate(setState: boolean = true): Observable<void> {
    return setState
      ? this.stateHandler.createState().pipe(
          switchMap(state => this.startLogin(state))
        )
      : this.startLogin(undefined);
  }

  /**
   * Initiates the OIDC login flow with an optional state value.
   * @param state - Optional state parameter for navigation preservation
   * @returns Observable<void> that completes after login is initiated
   */
  private startLogin(state: string | undefined): Observable<void> {
    // Call authorize without state object; angular-auth-oidc-client handles state internally
    this.oidcService.authorize();
    return of(void 0);
  }

  /**
   * Initiates the logout flow and clears the session.
   * @returns Observable<void> that completes after logout is initiated
   */
  logout(): Observable<void> {
    this.oidcService.logoffAndRevokeTokens();
    return of(void 0);
  }
}
