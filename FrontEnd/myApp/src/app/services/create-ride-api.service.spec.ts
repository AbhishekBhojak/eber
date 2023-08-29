import { TestBed } from '@angular/core/testing';

import { CreateRideApiService } from './create-ride-api.service';

describe('CreateRideApiService', () => {
  let service: CreateRideApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateRideApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
