import { Injectable, OnDestroy } from '@angular/core';
import { GuardsCheckStart, Router, RouterEvent } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable, Subject, throwError } from 'rxjs';
import { filter, map, shareReplay, switchMap, take, takeUntil } from 'rxjs/operators';
import { StatehandlerProcessorService } from './statehandler-processor.service';



export abstract class StatehandlerService {
    public abstract createState(): Observable<string | undefined>;
    public abstract initStateHandler(router: Router): void;
}

@Injectable({ providedIn: 'root' })
export class StatehandlerServiceImpl
    implements StatehandlerService, OnDestroy {
    private events?: Observable<string>;
    private unsubscribe$: Subject<void> = new Subject();

    ;
    constructor(oauthService: OAuthService/* = inject(OAuthService)*/, private processor: StatehandlerProcessorService) {

        oauthService.events
            .pipe(
                filter(event => event.type === 'token_received'),
                map(() => oauthService.state),
                takeUntil(this.unsubscribe$),
            )
            .subscribe(state => this.processor.restoreState(state));
    }

    public initStateHandler(router: Router): void {
        this.events = (router.events as Observable<RouterEvent>).pipe(
            filter(event => event instanceof GuardsCheckStart),
            map(event => event.url),
            shareReplay(1),
        );

        this.events.pipe(takeUntil(this.unsubscribe$)).subscribe();
    }

    public createState(): Observable<string | undefined> {
        if (this.events === undefined) {
            return throwError(() => new Error('no router events'));
        }

        return this.events.pipe(
            take(1),
            switchMap(url => this.processor.createState(url)),
        );
    }

    public ngOnDestroy(): void {
        this.unsubscribe$.next();
    }
}
