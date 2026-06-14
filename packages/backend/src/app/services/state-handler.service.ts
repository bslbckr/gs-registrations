import { Injectable, inject, OnDestroy } from '@angular/core';
import { GuardsCheckStart, Router, RouterEvent } from '@angular/router';
import { EventTypes, OidcSecurityService, PublicEventsService } from 'angular-auth-oidc-client';
import { Observable, Subject, throwError } from 'rxjs';
import { filter, map, shareReplay, switchMap, take, takeUntil } from 'rxjs/operators';
import { StatehandlerProcessorService } from './statehandler-processor.service';

/**
 * Abstract interface for state handling across authentication flows.
 * Enables state preservation during OAuth callback redirects.
 */
export abstract class StatehandlerService {
  /**
   * Creates a state value from the current router URL.
   * @returns Observable that emits the created state string or undefined
   */
  abstract createState(): Observable<string | undefined>;

  /**
   * Initializes the state handler with router events.
   * @param router - The Angular router instance
   */
  abstract initStateHandler(router: Router): void;
}

/**
 * Implementation of StatehandlerService using angular-auth-oidc-client events.
 * Manages OIDC state preservation and restoration during authentication flows.
 *
 * SOLID Principles:
 * - Single Responsibility: Handles only state creation and restoration logic
 * - Open/Closed: Extends abstract StatehandlerService without modification
 * - Liskov Substitution: Can be used anywhere StatehandlerService is expected
 * - Interface Segregation: Depends only on required abstractions
 * - Dependency Inversion: Depends on injected services, not concrete implementations
 */
@Injectable({ providedIn: 'root' })
export class StatehandlerServiceImpl implements StatehandlerService, OnDestroy {
  private routerEvents$: Observable<string> | null = null;
  private readonly destroy$: Subject<void> = new Subject();

  private readonly processor: StatehandlerProcessorService = inject(StatehandlerProcessorService);
  private readonly oidcService: OidcSecurityService = inject(OidcSecurityService);
  private readonly publicEventsService: PublicEventsService = inject(PublicEventsService);

  constructor() {
    this.setupStateRestoration();
  }

  /**
   * Sets up listeners for OIDC events to restore state after authentication.
   * Listens for successful token reception and restores the saved navigation state.
   */
  private setupStateRestoration(): void {
    this.publicEventsService.registerForEvents()
      .pipe(
        filter(event => event.type === EventTypes.NewAuthenticationResult),
        switchMap(() => {
          // Extract state from the URL after redirect
          const params = new URLSearchParams(window.location.search);
          const state = params.get('state');
          return state ? [state] : [];
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(state => this.processor.restoreState(state));
  }

  /**
   * Initializes router event tracking for state creation.
   * Captures the current URL when guards are checked to preserve navigation intent.
   *
   * @param router - The Angular router instance
   */
  initStateHandler(router: Router): void {
    this.routerEvents$ = (router.events as Observable<RouterEvent>).pipe(
      filter(event => event instanceof GuardsCheckStart),
      map(event => event.url),
      shareReplay(1),
      takeUntil(this.destroy$)
    );

    // Activate the observable chain
    this.routerEvents$.subscribe();
  }

  /**
   * Creates a state value from the current router navigation URL.
   * Used to preserve navigation context during OAuth redirects.
   *
   * @returns Observable<string | undefined> - The created state value or undefined if router events not initialized
   * @throws Error if router events have not been initialized via initStateHandler()
   */
  createState(): Observable<string | undefined> {
    if (this.routerEvents$ == null) {
      return throwError(() => new Error('Router events not initialized. Call initStateHandler() first.'));
    }

    return this.routerEvents$.pipe(
      take(1),
      switchMap(url => this.processor.createState(url))
    );
  }

  /**
   * Cleanup lifecycle hook to unsubscribe from all observables.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
