import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { NotiConfig } from '../../interfaces/notifications.interface';

@Component({
  selector: 'app-notification-container',
  template: `
    <div
      class="noti-backdrop"
      *ngIf="notification?.mode === 'confirm'"
      (click)="onDismiss()">
    </div>

    <div
      class="noti-host"
      [class.noti-host--confirm]="notification.mode === 'confirm'"
      *ngIf="notification">
      <app-notifications
        [config]="notification"
        (closed)="onDismiss()"
        (action)="onAction($event)">
      </app-notifications>
    </div>
  `,
  styles: [`
    .noti-host {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1050;
    }

    .noti-host--confirm {
      top: 50%;
      left: 50%;
      right: auto;
      transform: translate(-50%, -50%);
    }

    .noti-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      z-index: 1040;
    }
  `]
})
export class NotificationContainerComponent implements OnInit, OnDestroy {

  notification: NotiConfig | null = null;
  private subscription?: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notification$.subscribe(
      notification => this.notification = notification
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onDismiss(): void {
    this.notificationService.dismiss();
  }

  onAction(confirmed: boolean): void {
    this.notificationService.resolveConfirm(confirmed);
  }
}
