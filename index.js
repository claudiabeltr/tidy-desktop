const { app, BrowserWindow, ipcMain } = require('electron');

let offset = 0;

function createPostIt() {
  const win = new BrowserWindow({
    width: 220,
    height: 220,
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

  win.loadFile('postit.html');
  offset += 30; /* increments number per postit (+) */
}

app.whenReady().then(() => {
  createPostIt();
});

ipcMain.on('create-postit', () => {
  createPostIt();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});