import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationService } from './registration.service';
import { RegistrationsComponent } from './registrations/registrations.component';
import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';
import { StartComponent } from './start/start.component';
import { StatehandlerProcessorService, StatehandlerProcessorServiceImpl } from './services/statehandler-processor.service';
import { environment } from 'src/environments/environment';
import { StatehandlerService, StatehandlerServiceImpl } from './services/state-handler.service';
import { PlatformLocation } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
const authConfig: AuthConfig = {
    issuer: environment.oidc.issuer,
    clientId: environment.oidc.clientId,
    responseType: 'code',
    //    redirectUri: window.location.origin  + '/auth/callback',
    scope: 'openid profile email offline_access manager',
    oidc: true,
    strictDiscoveryDocumentValidation: false,
    showDebugInformation: true,

};

const stateHandlerFn = (stateHandler: StatehandlerService) => {
    return () => {
        return stateHandler.initStateHandler();
    };
};

@NgModule({
    declarations: [
        AppComponent,
        RegistrationsComponent,
        StartComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        OAuthModule.forRoot({
            resourceServer: {
                allowedUrls: ['/api/backend'],
                sendAccessToken: true
            }
        }),
        AppRoutingModule,
        MatTableModule,
        MatCheckboxModule
    ],
    providers: [
        { provide: RegistrationService },
        {
            provide: AuthConfig,
            useFactory: (s: PlatformLocation) => {
                authConfig.redirectUri = window.location.origin + s.getBaseHrefFromDOM() + 'auth/callback';
                return authConfig;
            },
            deps: [PlatformLocation]
        },
        { provide: StatehandlerProcessorService, useClass: StatehandlerProcessorServiceImpl },
        { provide: StatehandlerService, useClass: StatehandlerServiceImpl },
        { provide: APP_INITIALIZER, useFactory: stateHandlerFn, multi: true, deps: [StatehandlerService] }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
