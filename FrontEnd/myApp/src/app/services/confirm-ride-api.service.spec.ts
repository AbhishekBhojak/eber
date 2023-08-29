import { TestBed } from '@angular/core/testing';

import { ConfirmRideApiService } from './confirm-ride-api.service';

describe('ConfirmRideApiService', () => {
  let service: ConfirmRideApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmRideApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
