import { TestBed } from '@angular/core/testing';

import { RunningRequestApiService } from './running-request-api.service';

describe('RunningRequestApiService', () => {
  let service: RunningRequestApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RunningRequestApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
