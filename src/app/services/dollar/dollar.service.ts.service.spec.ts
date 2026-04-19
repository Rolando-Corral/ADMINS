import { TestBed } from '@angular/core/testing';

import { DollarServiceTsService } from './dollar.service.ts.service';

describe('DollarServiceTsService', () => {
  let service: DollarServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DollarServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
