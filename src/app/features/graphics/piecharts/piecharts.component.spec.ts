import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiechartsComponent } from './piecharts.component';
import { HttpClientModule } from '@angular/common/http';

describe('PiechartsComponent', () => {
  let component: PiechartsComponent;
  let fixture: ComponentFixture<PiechartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiechartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
