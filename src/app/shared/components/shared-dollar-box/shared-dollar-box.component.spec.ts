import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDollarBoxComponent } from './shared-dollar-box.component';

describe('SharedDollarBoxComponent', () => {
  let component: SharedDollarBoxComponent;
  let fixture: ComponentFixture<SharedDollarBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SharedDollarBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedDollarBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
