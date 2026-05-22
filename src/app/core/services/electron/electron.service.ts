import { Injectable, NgZone } from '@angular/core';
import { ElectronAPI } from '../../interfaces/electron-api.interface';

@Injectable({ providedIn: 'root' })
export class ElectronService {

  constructor(private ngZone: NgZone) {}

  get isElectron(): boolean {
    return !!(window as any).electronAPI?.isElectron;
  }

  getAll<T>(collection: string): Promise<T[]> {
    return this.wrapIPC(api => api.db.getAll<T>(collection), []);
  }

  getById<T>(collection: string, id: string): Promise<T | null> {
    return this.wrapIPC(api => api.db.getById<T>(collection, id), null);
  }

  create<T>(collection: string, item: T): Promise<T> {
    const api = (window as any).electronAPI as ElectronAPI | undefined;
    if (!api?.isElectron) {
      return Promise.reject(new Error('Electron API no disponible'));
    }
    return new Promise<T>((resolve, reject) => {
      api.db.create(collection, item)
        .then(r => this.ngZone.run(() => resolve(r)))
        .catch(e => this.ngZone.run(() => reject(e)));
    });
  }

  update<T>(collection: string, id: string, item: Partial<T>): Promise<T | null> {
    return this.wrapIPC(api => api.db.update(collection, id, item), null);
  }

  delete(collection: string, id: string): Promise<boolean> {
    return this.wrapIPC(api => api.db.delete(collection, id), false);
  }

  private wrapIPC<T>(fn: (api: ElectronAPI) => Promise<T>, fallback: T): Promise<T> {
    const api = (window as any).electronAPI as ElectronAPI | undefined;
    if (!api?.isElectron) {
      return Promise.resolve(fallback);
    }
    return new Promise<T>((resolve, reject) => {
      fn(api)
        .then(r => this.ngZone.run(() => resolve(r)))
        .catch(e => this.ngZone.run(() => reject(e)));
    });
  }
}
