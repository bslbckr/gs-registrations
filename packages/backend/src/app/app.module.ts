import { APP_INITIALIZER, inject, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationService } from './registration.service';
import { RegistrationsComponent } from './registrations/registrations.component';
import { AuthConfig, OAuthModule, OAuthModuleConfig, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { StartComponent } from './start/start.component';
import { StatehandlerProcessorService, StatehandlerProcessorServiceImpl } from './services/statehandler-processor.service';
import { environment } from 'src/environments/environment';
import { StatehandlerService, StatehandlerServiceImpl } from './services/state-handler.service';
import { PlatformLocation } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

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

@NgModule({
    declarations: [
        AppComponent,
        RegistrationsComponent,
        StartComponent
    ],
    imports: [
        BrowserModule,
        NoopAnimationsModule,
        HttpClientModule,
        OAuthModule.forRoot(),
        AppRoutingModule,
        MatTableModule,
        MatTabsModule,
        MatCheckboxModule
    ],
    providers: [
        { provide: RegistrationService },
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
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
