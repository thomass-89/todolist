const { app, BrowserWindow } = require('electron');

function createWindow () {
  // Create a new window with fixed dimensions
  const win = new BrowserWindow({
    width: 800,    // Window width (adjust as needed)
    height: 600,   // Window height (adjust as needed)
    resizable: false,  // Prevent resizing if you want a fixed-size window
    webPreferences: {
      nodeIntegration: true,   // Enable Node integration if needed
      contextIsolation: false  // Set to false for compatibility (or true if you adjust your code)
    }
  });

  // Load your index.html file
  win.loadFile('index.html');

  // Optionally, remove the default menu
  win.setMenu(null);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS, recreate a window when the dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
