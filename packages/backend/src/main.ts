import { inject, provideAppInitializer } from '@angular/core';


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
import { AuthConfig, OAuthStorage, OAuthService, provideOAuthClient } from 'angular-oauth2-oidc';
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
function storageFactory(): OAuthStorage { return localStorage; }

bootstrapApplication(AppComponent, {
    providers: [
      //importProvidersFrom(BrowserModule, MatTableModule, MatTabsModule, MatCheckboxModule),
      
      provideOAuthClient({
                resourceServer: {
                    allowedUrls: ['/api/backend'],
                    sendAccessToken: true
                }
            }),
        { provide: RegistrationService },
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
        { provide: AuthService },
        { provide: StatehandlerProcessorService, useClass: StatehandlerProcessorServiceImpl },
        {
            provide: StatehandlerService,
            useFactory: () => {
                const oauth = inject(OAuthService);
                const proc = inject(StatehandlerProcessorService);
                return new StatehandlerServiceImpl(oauth, proc);
            }
        },
        provideAppInitializer(() => {
        const initializerFn = (() => {
                const rtr = inject(Router);
                const handler = inject(StatehandlerService);
                return () => handler.initStateHandler(rtr);
            })();
        return initializerFn();
      }),
      //provideNoopAnimations(),
        provideHttpClient(withInterceptorsFromDi())
    ]
})
    .catch(err => console.error(err));
