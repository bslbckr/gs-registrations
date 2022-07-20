import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';


import { IRegistration } from './iregistration';

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {

    constructor(private client: HttpClient) { }

    get registrations(): Observable<IRegistration[]> {
        return this.client.get<IRegistration[]>("/api/backend/registrations");
    }

    deleteRegistration(id: number): Observable<boolean> {
        return this.client.delete(`/api/backend/registrations/${id}`)
            .pipe(map(() => true));
    }

    confirmRegistration(id: number, confirmed: boolean = true): Observable<boolean> {
        return this.genericPost(`/api/backend/registrations/${id}/confirm`, this.confirmedPayload(confirmed));
    }

    markAsPaid(id: number, paid: boolean = true): Observable<boolean> {
        return this.genericPost(`/api/backend/registrations/${id}/paid`, this.paidPayload(paid));
    }

    addToWaitingList(id: number, waitingList: boolean = true): Observable<boolean> {
        return this.genericPost(`/api/backend/registrations/${id}/waiting`, this.waitingListPayload(waitingList));
    }

    private confirmedPayload(value: boolean): { confirmed: boolean } {
        return { confirmed: value };
    }
    private paidPayload(value: boolean): { paid: boolean } {
        return { paid: value };
    }
    private waitingListPayload(value: boolean): { waitingList: boolean } {
        return { waitingList: value };
    }

    private genericPost<T>(url: string, payload: T): Observable<boolean> {
        return this.client.post(url, payload)
            .pipe(
                map(() => true),
                catchError(error => {
                    console.error(error);
                    return of(false);
                })
            );
    }
}
