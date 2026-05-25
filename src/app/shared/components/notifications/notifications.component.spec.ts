import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotiConfig } from '../../interfaces/notifications.interface';
import { NotificationsComponent } from './notifications.component';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  const mockConfig: NotiConfig = {
    title: 'Test',
    message: 'Mensaje de prueba',
    icon: 'bi-info-circle-fill',
    close: true,
    type: 'info',
    mode: 'toast',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    component.config = mockConfig;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closed when onClose is called', () => {
    spyOn(component.closed, 'emit');
    component.onClose();
    expect(component.closed.emit).toHaveBeenCalled();
  });

  it('should emit action true on confirm', () => {
    component.config = { ...mockConfig, mode: 'confirm' };
    spyOn(component.action, 'emit');
    component.onConfirm();
    expect(component.action.emit).toHaveBeenCalledWith(true);
  });

  it('should emit action false on cancel', () => {
    component.config = { ...mockConfig, mode: 'confirm' };
    spyOn(component.action, 'emit');
    component.onCancel();
    expect(component.action.emit).toHaveBeenCalledWith(false);
  });
});
