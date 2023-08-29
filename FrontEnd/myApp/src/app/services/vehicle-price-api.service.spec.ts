import { TestBed } from '@angular/core/testing';

import { VehiclePriceApiService } from './vehicle-price-api.service';

describe('VehiclePriceApiService', () => {
  let service: VehiclePriceApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehiclePriceApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
