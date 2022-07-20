import { TestBed } from '@angular/core/testing';

import { StatehandlerProcessorService } from './statehandler-processor.service';

describe('StatehandlerProcessorService', () => {
  let service: StatehandlerProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatehandlerProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
