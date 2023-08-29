import { TestBed } from '@angular/core/testing';

import { VehicleTypeApiService } from './vehicle-type-api.service';

describe('VehicleTypeApiService', () => {
  let service: VehicleTypeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleTypeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
