import { TestBed } from '@angular/core/testing';

import { AssetsServiceTsService } from './assets.service.ts.service';

describe('AssetsServiceTsService', () => {
  let service: AssetsServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetsServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
