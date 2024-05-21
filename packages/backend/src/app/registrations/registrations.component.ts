import { Component, inject, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { IRegistration } from '../iregistration';
import { RegistrationService } from '../registration.service';

@Component({
    selector: 'app-registrations',
    templateUrl: './registrations.component.html',
    styleUrls: ['./registrations.component.css']
})
export class RegistrationsComponent implements OnInit {
    private registrations: IRegistration[] = [];
    registrationsX: IRegistration[] = [];
    registrationsW: IRegistration[] = [];
    registrationsO: IRegistration[] = [];
    displayedColumns: string[] = ["id", "team", "city", "contact", "strength", "mail", "comment", "regdate", "paid", "confirmed", "waitingList", "position"];
    private regSvc: RegistrationService = inject(RegistrationService);
    constructor() { }

    ngOnInit() {
        this.regSvc.registrations
            .pipe(first())
            .subscribe((regs: IRegistration[]) => {
                this.registrations = regs;
                this.registrationsO = regs.filter(r => r.division === 'O');
                this.registrationsX = regs.filter(r => r.division === 'X');
                this.registrationsW = regs.filter(r => r.division === 'W');
            });
    }

    toggleConfirmation(reg: IRegistration) {
        this.regSvc.confirmRegistration(reg.id, !reg.confirmed)
            .pipe(first())
            .subscribe();
    }

    togglePaid(reg: IRegistration) {
        this.regSvc.markAsPaid(reg.id, !reg.paid)
            .pipe(first())
            .subscribe();
    }

    toggleWaitingList(reg: IRegistration) {
        this.regSvc.addToWaitingList(reg.id, !reg.waitingList)
            .pipe(first())
            .subscribe();
    }
}
