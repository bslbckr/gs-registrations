import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { RegistrationsComponent } from './registrations/registrations.component';
import { StartComponent } from './start/start.component';

export const routes: Routes = [
    {
        path: 'registrations',
        component: RegistrationsComponent,
        canActivate: [authGuard]
    },
    { path: 'auth/callback', redirectTo: 'registrations' },
    { path: '**', component: StartComponent, pathMatch: 'full' }
];
