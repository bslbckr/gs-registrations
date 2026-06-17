import { LogLevel, PassedInitialConfig } from 'angular-auth-oidc-client';
import {environment} from '../../environments/environment';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: environment.oidc.issuer,
    clientId: environment.oidc.clientId,
    redirectUrl: `${window.location.origin}/${environment.href}auth/callback`,
    postLogoutRedirectUri: `${window.location.origin}${window.location.pathname}`,
    responseType: 'code',
    scope: 'openid profile email offline_access',
    historyCleanupOff: true,
    autoUserInfo: true,
    //autoCleanupToken: true,
    logLevel: environment.production ? LogLevel.Warn : LogLevel.Debug,
    silentRenew: true,
    useRefreshToken: true,
    ignoreNonceAfterRefresh: true, 
    secureRoutes: ['/api/backend/*']
  }
};
