import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { StatehandlerService } from './state-handler.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _authenticated = false;
    constructor(private authConf: AuthConfig, private outh: OAuthService, private stateHandler: StatehandlerService) { }

    get authenticated(): boolean {
        return this._authenticated;
    }

    public async authenticate(setState: boolean = true): Promise<boolean> {
        this.outh.configure(this.authConf);
        await this.outh.loadDiscoveryDocumentAndTryLogin();

        this._authenticated = this.outh.hasValidAccessToken();

        if (!this.outh.hasValidIdToken() || !this._authenticated) {
            const newState = setState ? await this.stateHandler.createState().toPromise() : undefined;
            this.outh.initCodeFlow(newState);
        }
        //this._authenticationChanged.next(this.authenticated);

        return this._authenticated;
    }
}
