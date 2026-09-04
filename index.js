const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

const dataFile = path.join(app.getPath('userData'), 'postits.json');
let offset = 0;
const windows = {} // id -> BrowserWindow

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  } catch {
    return {
      nextId: 1, postits: {}
    };
  }
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

let data = loadData();

function createPostIt(id, state = {}) {
  const win = new BrowserWindow({
    width: state.width || 220,
    height: state.height || 220,
    x: state.x !== undefined ? state.x : 100 + offset,
    y: state.y !== undefined ? state.y : 100 + offset,
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
  win.loadFile('postit.html', {
    query: {
      id: String(id)
    }
  });
  offset += 30; /* increments number per postit (+) */

  // electron native
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

function updatePostit(id, updates) {
  data.postits[id] = { ...data.postits[id], ...updates};
  saveData(data);
}

function deletePostit(id) {
  delete data.postits[id];
  saveData(data);
}

app.whenReady().then(() => {
  const ids = Object.keys(data.postits);
  if (ids.length === 0) {
    const id = data.nextId++;
    data.postits[id] = {};
    saveData(data)
    createPostIt(id);
  } else {
    ids.forEach(id =>
      createPostIt(id, data.postits[id])
    );
  }
});

ipcMain.on('create-postit', () => {
  const id = data.nextId++;
  data.postits[id] = {};
  saveData(data);
  createPostIt(id);
});

ipcMain.on('update-postit', (event, id, updates) => {
  updatePostit(id, updates);
});

ipcMain.on('delete-postit', (event, id) => {
  deletePostit(id);
  if (windows[id]) windows[id].close();
});

ipcMain.handle('get-postit-data', (event, id) => {
  return data.postits[id] || {};
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});