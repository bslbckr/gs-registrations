import { enableProdMode, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, provideZonelessChangeDetection } from '@angular/core';


import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { StatehandlerService, StatehandlerServiceImpl } from './app/services/state-handler.service';
import { StatehandlerProcessorService, StatehandlerProcessorServiceImpl } from './app/services/statehandler-processor.service';
import { AuthService } from './app/services/auth.service';
import { PlatformLocation } from '@angular/common';
import { AuthConfig, OAuthStorage, OAuthService, provideOAuthClient, OAuthModuleConfig } from 'angular-oauth2-oidc';
import { RegistrationService } from './app/registration.service';

const authConfig: AuthConfig = {
    issuer: environment.oidc.issuer,
    clientId: environment.oidc.clientId,
    responseType: 'code',
    scope: 'openid profile email offline_access',
    oidc: true,
    strictDiscoveryDocumentValidation: false,
    showDebugInformation: true,

};

const authModuleConfig: OAuthModuleConfig = {
  resourceServer: {
    allowedUrls: ['/api/backend'],
    sendAccessToken: true
  }
};

function storageFactory(): OAuthStorage { return localStorage; }

if(environment.production) {
  enableProdMode();
} 

bootstrapApplication(AppComponent, {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideOAuthClient(authModuleConfig),
    RegistrationService,
    provideRouter(routes),
    {
      provide: AuthConfig,
      useFactory: () => {
        authConfig.redirectUri = window.location.origin + inject(PlatformLocation).getBaseHrefFromDOM() + 'auth/callback';
        return authConfig;
      }
    },
    {
      provide: OAuthStorage,
      useFactory: storageFactory
    },
    AuthService,
    { provide: StatehandlerProcessorService, useClass: StatehandlerProcessorServiceImpl },
      /*{
        provide: StatehandlerService,
        useClass: StatehandlerProcessorServiceImpl
        },*/
    StatehandlerServiceImpl,/*
      provideAppInitializer(() => {
        const rtr = inject(Router);
        const handler = inject(StatehandlerServiceImpl);
        handler.initStateHandler(rtr);
        }),*/
    provideHttpClient(withInterceptorsFromDi())
  ]
})
  .catch(err => console.error(err));
