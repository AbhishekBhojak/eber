import { TestBed } from '@angular/core/testing';

import { RideHistoryApiService } from './ride-history-api.service';

describe('RideHistoryApiService', () => {
  let service: RideHistoryApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RideHistoryApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
