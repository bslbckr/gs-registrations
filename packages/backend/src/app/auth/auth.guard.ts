import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { AuthService } from '../services/auth.service';


export const authGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    if (!auth.authenticated) {
        return auth.authenticate();
    }
    return auth.authenticated;
};
