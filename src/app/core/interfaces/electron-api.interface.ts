export interface ElectronAPI {
  isElectron: true;
  db: {
    getAll: <T>(collection: string) => Promise<T[]>;
    getById: <T>(collection: string, id: string) => Promise<T | null>;
    create: <T>(collection: string, item: T) => Promise<T>;
    update: <T>(collection: string, id: string, item: Partial<T>) => Promise<T | null>;
    delete: (collection: string, id: string) => Promise<boolean>;
  };
}
