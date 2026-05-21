import { Injectable } from '@angular/core';
import { ElectronAPI } from '../../interfaces/electron-api.interface';

@Injectable({ providedIn: 'root' })
export class ElectronService {
  get isElectron(): boolean {
    return !!(window as any).electronAPI?.isElectron;
  }

  getAll<T>(collection: string): Promise<T[]> {
    const api = (window as any).electronAPI as ElectronAPI | undefined;
    if (!api?.isElectron) {
      return Promise.resolve([]);
    }
    return api.db.getAll<T>(collection);
  }

  getById<T>(collection: string, id: string): Promise<T | null> {
    const api = (window as any).electronAPI as ElectronAPI | undefined;
    if (!api?.isElectron) {
      return Promise.resolve(null);
    }
    return api.db.getById<T>(collection, id);
  }

  create<T>(collection: string, item: T): Promise<T> {
    const api = (window as any).electronAPI as ElectronAPI | undefined;
    if (!api?.isElectron) {
      return Promise.reject(new Error('Electron API no disponible'));
    }
    return api.db.create<T>(collection, item);
  }

  update<T>(collection: string, id: string, item: Partial<T>): Promise<T | null> {
    const api = (window as any).electronAPI as ElectronAPI | undefined;
    if (!api?.isElectron) {
      return Promise.reject(new Error('Electron API no disponible'));
    }
    return api.db.update<T>(collection, id, item);
  }

  delete(collection: string, id: string): Promise<boolean> {
    const api = (window as any).electronAPI as ElectronAPI | undefined;
    if (!api?.isElectron) {
      return Promise.reject(new Error('Electron API no disponible'));
    }
    return api.db.delete(collection, id);
  }
}
