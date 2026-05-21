const { contextBridge, ipcRenderer } = require('electron');

console.log('[Electron Preload] Inicializando...');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  db: {
    getAll: (collection) => ipcRenderer.invoke('db:getAll', collection),
    getById: (collection, id) => ipcRenderer.invoke('db:getById', collection, id),
    create: (collection, item) => ipcRenderer.invoke('db:create', collection, item),
    update: (collection, id, item) => ipcRenderer.invoke('db:update', collection, id, item),
    delete: (collection, id) => ipcRenderer.invoke('db:delete', collection, id),
  },
});

console.log('[Electron Preload] API expuesta correctamente');
