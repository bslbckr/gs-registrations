import { TestBed } from '@angular/core/testing';

import { StatehandlerService } from './state-handler.service';

describe('StateHandlerService', () => {
    let service: StatehandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StatehandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
