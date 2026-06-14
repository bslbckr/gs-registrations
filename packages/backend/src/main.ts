import { enableProdMode, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  provideOidcClient,
  LogLevel,
  AuthWellknownEndpointsService
} from 'angular-auth-oidc-client';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module';
import { AuthService } from './app/services/auth.service';
import { RegistrationService } from './app/registration.service';
import { StatehandlerServiceImpl } from './app/services/state-handler.service';
import { StatehandlerProcessorService, StatehandlerProcessorServiceImpl } from './app/services/statehandler-processor.service';

if (environment.production) {
  enableProdMode();
}

/**
 * Initializes OIDC configuration for angular-auth-oidc-client.
 * Called during application bootstrap to configure authentication settings.
 */
function initializeOidcConfiguration(): void {
  const authService = inject(AuthService);
  const wellknownService = inject(AuthWellknownEndpointsService);
  const router = inject(Router);
  const stateHandler = inject(StatehandlerServiceImpl);

  // Initialize router event tracking for state preservation
  stateHandler.initStateHandler(router);

  // Load OIDC configuration from discovery endpoint
  wellknownService.getAuthWellKnownEndPoints(environment.oidc.issuer).subscribe();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideOidcClient({
      config: {
        authority: environment.oidc.issuer,
        clientId: environment.oidc.clientId,
        redirectUrl: `${window.location.origin}${window.location.pathname}auth/callback`,
        postLogoutRedirectUrl: `${window.location.origin}${window.location.pathname}`,
        responseType: 'code',
        scope: 'openid profile email offline_access',
        historyCleanupOff: true,
        autoUserInfo: true,
        autoCleanupToken: true,
        logLevel: environment.production ? LogLevel.None : LogLevel.Debug
      }
    }),
    AuthService,
    RegistrationService,
    { provide: StatehandlerProcessorService, useClass: StatehandlerProcessorServiceImpl },
    StatehandlerServiceImpl
  ]
}).catch(err => console.error('Bootstrap error:', err));
