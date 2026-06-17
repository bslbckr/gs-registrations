import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {routes} from './app-routing.module';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { RegistrationService } from './registration.service';
import { AuthService } from './services/auth.service';
import { authConfig } from './auth/auth.config';
import {authInterceptor, provideAuth, withAppInitializerAuthCheck} from 'angular-auth-oidc-client';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor()])),
    provideAuth(authConfig, withAppInitializerAuthCheck()),
    AuthService,
    RegistrationService
  ]
}
