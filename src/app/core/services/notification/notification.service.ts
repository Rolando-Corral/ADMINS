import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  ConfirmOptions,
  NotiConfig,
  NotificationType,
} from '../../../shared/interfaces/notifications.interface';

const DEFAULT_DURATION = 5000;

const TYPE_ICONS: Record<NotificationType, string> = {
  success: 'bi-check-circle-fill',
  error: 'bi-x-circle-fill',
  warning: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill',
};

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private readonly notificationSubject = new BehaviorSubject<NotiConfig | null>(null);
  readonly notification$ = this.notificationSubject.asObservable();

  private dismissTimer?: ReturnType<typeof setTimeout>;
  private confirmResolver?: (confirmed: boolean) => void;

  show(config: NotiConfig): void {
    const notification = this.normalize(config, 'toast');
    this.clearTimer();
    this.notificationSubject.next(notification);

    const duration = notification.duration ?? 0;
    if (duration > 0) {
      this.dismissTimer = setTimeout(() => this.dismiss(), duration);
    }
  }

  /**
   * Muestra un diálogo de confirmación. Resuelve `true` si confirma, `false` si cancela.
   */
  confirm(config: ConfirmOptions | string): Promise<boolean> {
    const options: ConfirmOptions = typeof config === 'string'
      ? { message: config }
      : config;

    return new Promise<boolean>((resolve) => {
      this.confirmResolver = resolve;
      this.clearTimer();
      this.notificationSubject.next(
        this.normalize({
          message: options.message,
          title: options.title ?? 'Confirmar',
          type: options.type ?? 'warning',
          icon: options.icon,
          mode: 'confirm',
          close: false,
          duration: 0,
          confirmLabel: options.confirmLabel ?? 'Confirmar',
          cancelLabel: options.cancelLabel ?? 'Cancelar',
        }, 'confirm')
      );
    });
  }

  success(message: string, title = 'Éxito', duration = DEFAULT_DURATION): void {
    this.show({ message, title, type: 'success', duration });
  }

  error(message: string, title = 'Error', duration = DEFAULT_DURATION): void {
    this.show({ message, title, type: 'error', duration });
  }

  warning(message: string, title = 'Aviso', duration = DEFAULT_DURATION): void {
    this.show({ message, title, type: 'warning', duration });
  }

  info(message: string, title = 'Información', duration = DEFAULT_DURATION): void {
    this.show({ message, title, type: 'info', duration });
  }

  resolveConfirm(confirmed: boolean): void {
    if (this.confirmResolver) {
      const resolver = this.confirmResolver;
      this.confirmResolver = undefined;
      this.clearTimer();
      this.notificationSubject.next(null);
      resolver(confirmed);
      return;
    }
    this.dismiss();
  }

  dismiss(): void {
    if (this.confirmResolver) {
      this.resolveConfirm(false);
      return;
    }
    this.clearTimer();
    this.notificationSubject.next(null);
  }

  private normalize(config: NotiConfig, defaultMode: 'toast' | 'confirm'): NotiConfig {
    const type = config.type ?? 'info';
    const mode = config.mode ?? defaultMode;
    const isConfirm = mode === 'confirm';

    return {
      title: config.title ?? '',
      message: config.message,
      type,
      mode,
      icon: config.icon ?? TYPE_ICONS[type],
      close: config.close ?? !isConfirm,
      duration: isConfirm ? 0 : (config.duration ?? DEFAULT_DURATION),
      confirmLabel: config.confirmLabel ?? 'Confirmar',
      cancelLabel: config.cancelLabel ?? 'Cancelar',
    };
  }

  private clearTimer(): void {
    if (this.dismissTimer) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = undefined;
    }
  }
}
