import { TestBed } from '@angular/core/testing';
import { StockService } from './stock-service.service';
import { HttpClientModule } from '@angular/common/http';



describe('StockServiceService', () => {
  let service: StockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ]
    });
    service = TestBed.inject(StockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
