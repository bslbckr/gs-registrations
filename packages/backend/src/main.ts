import { enableProdMode, inject, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { routes } from './app/app-routing.module';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { StatehandlerService, StatehandlerServiceImpl } from './app/services/state-handler.service';
import { StatehandlerProcessorService, StatehandlerProcessorServiceImpl } from './app/services/statehandler-processor.service';
import { AuthService } from './app/services/auth.service';
import { PlatformLocation } from '@angular/common';
import { environment as environment_1 } from 'src/environments/environment';
import { AuthConfig, OAuthStorage, OAuthModuleConfig, OAuthService, OAuthModule } from 'angular-oauth2-oidc';
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



if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, OAuthModule.forRoot(), MatTableModule, MatTabsModule, MatCheckboxModule),
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
        {
            provide: OAuthModuleConfig,
            useValue: {
                resourceServer: {
                    allowedUrls: ['/api/backend'],
                    sendAccessToken: true
                }
            }
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
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: () => {
                const rtr = inject(Router);
                const handler = inject(StatehandlerService);
                return () => handler.initStateHandler(rtr);
            }
        },
        provideNoopAnimations(),
        provideHttpClient(withInterceptorsFromDi())
    ]
})
    .catch(err => console.error(err));
