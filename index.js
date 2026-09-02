const { app, BrowserWindow } = require('electron');

function createPostIt() {
  const win = new BrowserWindow({
    width: 220,
    height: 220,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('postit.html');
}

app.whenReady().then(() => {
  createPostIt();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});