import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharesTableComponent } from './shares-table.component';

describe('SharesTableComponent', () => {
  let component: SharesTableComponent;
  let fixture: ComponentFixture<SharesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SharesTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
