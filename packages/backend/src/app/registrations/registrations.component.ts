import { Component, inject, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { IRegistration } from '../iregistration';
import { RegistrationService } from '../registration.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatTabGroup, MatTab } from '@angular/material/tabs';

@Component({
    selector: 'app-registrations',
    templateUrl: './registrations.component.html',
    styleUrls: ['./registrations.component.css'],
    standalone: true,
    imports: [MatTabGroup, MatTab, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatCheckbox, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
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
                this.registrationsX = regs.filter(r => r.division === 'M');
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
