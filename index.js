const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(app.getPath('userData'), 'postits.json');
const DEFAULT_SIZE = { width: 220, height: 220 };
const CASCADE_OFFSET = 30;

const windows = {}; // id -> BrowserWindow
let data = loadData();
let cascadeOffset = 0;

// --- Persistence ---
function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return { nextId: 1, postits: {} };
  }
}

function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function updatePostit(id, updates) {
  data.postits[id] = { ...data.postits[id], ...updates };
  saveData();
}

function deletePostit(id) {
  delete data.postits[id];
  saveData();
}

// --- Windows ---
function createPostIt(id, state = {}) {
  const win = new BrowserWindow({
    width: state.width || DEFAULT_SIZE.width,
    height: state.height || DEFAULT_SIZE.height,
    x: state.x !== undefined ? state.x : 100 + cascadeOffset,
    y: state.y !== undefined ? state.y : 100 + cascadeOffset,
    minWidth: 150,
    minHeight: 120,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  windows[id] = win;
  win.loadFile('postit.html', { query: { id: String(id) } });
  cascadeOffset += CASCADE_OFFSET;

  win.on('moved', () => {
    const [x, y] = win.getPosition();
    updatePostit(id, { x, y });
  });

  win.on('resized', () => {
    const [width, height] = win.getSize();
    updatePostit(id, { width, height });
  });

  win.on('closed', () => {
    delete windows[id];
  });
}

function createNewPostIt() {
  const id = data.nextId++;
  data.postits[id] = {};
  saveData();
  createPostIt(id);
}

// --- App lifecycle ---
app.whenReady().then(() => {
  const ids = Object.keys(data.postits);

  if (ids.length === 0) {
    createNewPostIt();
  } else {
    ids.forEach(id => createPostIt(id, data.postits[id]));
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// --- IPC (communication with renderer windows) ---
ipcMain.on('create-postit', createNewPostIt);

ipcMain.on('update-postit', (event, id, updates) => {
  updatePostit(id, updates);
});

ipcMain.on('delete-postit', (event, id) => {
  deletePostit(id);
  windows[id]?.close();
});

ipcMain.handle('get-postit-data', (event, id) => {
  return data.postits[id] || {};
});