const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

const DB_PATH = path.join(app.getPath('userData'), 'db.json');

function ensureDbFile() {
  if (!fs.existsSync(DB_PATH)) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify({ cuentas: [] }, null, 2), 'utf-8');
  }
}

function readDb() {
  ensureDbFile();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDb(data) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

ipcMain.handle('db:getAll', (_event, collection) => {
  const db = readDb();
  return db[collection] || [];
});

ipcMain.handle('db:getById', (_event, collection, id) => {
  const db = readDb();
  const items = db[collection] || [];
  return items.find(item => item.id === id) || null;
});

ipcMain.handle('db:create', (_event, collection, item) => {
  const db = readDb();
  if (!db[collection]) {
    db[collection] = [];
  }
  db[collection].push(item);
  writeDb(db);
  return item;
});

ipcMain.handle('db:update', (_event, collection, id, item) => {
  const db = readDb();
  const items = db[collection] || [];
  const index = items.findIndex(i => i.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...item };
    writeDb(db);
    return items[index];
  }
  return null;
});

ipcMain.handle('db:delete', (_event, collection, id) => {
  const db = readDb();
  const items = db[collection] || [];
  const index = items.findIndex(i => i.id === id);
  if (index !== -1) {
    items.splice(index, 1);
    writeDb(db);
    return true;
  }
  return false;
});

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js');

  if (!fs.existsSync(preloadPath)) {
    console.error('[Electron] Preload no encontrado en:', preloadPath);
  }

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https:",
        ],
      },
    });
  });

  const isDevServer = process.env.ELECTRON_DEV === 'true';

  if (isDevServer) {
    mainWindow.loadURL('http://localhost:4200');
  } else {
    const distIndex = path.join(__dirname, '..', 'dist', 'crr01', 'index.html');
    if (!fs.existsSync(distIndex)) {
      console.error('[Electron] Build Angular no encontrado en:', distIndex);
      console.error('[Electron] Ejecutá primero: npm run build:electron');
      return;
    }
    mainWindow.loadFile(distIndex);
  }

  if (process.env.OPEN_DEVTOOLS === 'true') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  ensureDbFile();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
