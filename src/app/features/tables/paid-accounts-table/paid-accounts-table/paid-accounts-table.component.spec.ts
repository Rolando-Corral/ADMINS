import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidAccountsTableComponent } from './paid-accounts-table.component';

describe('PaidAccountsTableComponent', () => {
  let component: PaidAccountsTableComponent;
  let fixture: ComponentFixture<PaidAccountsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PaidAccountsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaidAccountsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
