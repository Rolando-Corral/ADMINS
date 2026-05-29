import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotiConfig } from '../../interfaces/notifications.interface';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {

  @Input() config!: NotiConfig;
  @Output() closed = new EventEmitter<void>();
  @Output() action = new EventEmitter<boolean>();

  get isConfirm(): boolean {
    return this.config.mode === 'confirm';
  }

  get confirmButtonClass(): string {
    return this.config.type === 'error' ? 'danger' : 'primary';
  }

  onClose(): void {
    this.closed.emit();
  }

  onConfirm(): void {
    this.action.emit(true);
  }

  onCancel(): void {
    this.action.emit(false);
  }
}
