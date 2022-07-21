import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { RegistrationsComponent } from './registrations/registrations.component';
import { StartComponent } from './start/start.component';

const routes: Routes = [
    { path: 'registrations', component: RegistrationsComponent, canActivate: [AuthGuard] },
    { path: 'auth/callback', redirectTo: 'registrations' },
    { path: '**', component: StartComponent, pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
