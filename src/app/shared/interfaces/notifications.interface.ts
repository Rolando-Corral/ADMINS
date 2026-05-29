export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type NotificationMode = 'toast' | 'confirm';

export interface NotiConfig {
  title?: string;
  message: string;
  icon?: string;
  close?: boolean;
  type?: NotificationType;
  mode?: NotificationMode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Tiempo en ms antes de cerrar. 0 = sin auto-cierre. */
  duration?: number;
}

/** Opciones aceptadas por NotificationService.confirm() */
export type ConfirmOptions = Pick<
  NotiConfig,
  'message' | 'title' | 'type' | 'icon' | 'confirmLabel' | 'cancelLabel'
>;