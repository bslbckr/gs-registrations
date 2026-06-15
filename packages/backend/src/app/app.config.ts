import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {routes} from './app-routing.module';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RegistrationService } from './registration.service';
import { StatehandlerProcessorService, StatehandlerProcessorServiceImpl } from './services/statehandler-processor.service';
import { StatehandlerService, StatehandlerServiceImpl } from './services/state-handler.service';
import { AuthService } from './services/auth.service';
import { authConfig } from './auth/auth.config';
import {provideAuth} from 'angular-auth-oidc-client';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAuth(authConfig),
    AuthService,
    RegistrationService,
    { provide: StatehandlerProcessorService, useClass: StatehandlerProcessorServiceImpl },
    { provide: StatehandlerService, useClass: StatehandlerServiceImpl}

  ]
}
