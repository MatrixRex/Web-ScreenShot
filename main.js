const { app, BrowserWindow, ipcMain, dialog, screen } = require("electron");
const path = require("path");
const fs = require("fs");
const { captureScreenshot } = require("./capture");

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const win = new BrowserWindow({
    width: width,
    height: height,
    autoHideMenuBar: true, // This will hide the menu bar
    icon: path.join(__dirname, "assets/icon.png"), // Add the icon path
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.maximize(); // Add this line to maximize the window
  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();
});

ipcMain.handle("capture", async (event, { url, width }) => {
  try {
    const filePath = await captureScreenshot(url, width);
    return filePath;
  } catch (err) {
    return `Error: ${err.message}`;
  }
});

ipcMain.handle("save-image-as", async (event, { srcPath }) => {
  const result = await dialog.showSaveDialog({
    defaultPath: "screenshot.png",
    filters: [{ name: "Images", extensions: ["png"] }],
  });

  if (!result.canceled && result.filePath) {
    fs.copyFileSync(srcPath, result.filePath);
    return result.filePath;
  }

  return null;
});
