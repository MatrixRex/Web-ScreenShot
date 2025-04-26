const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  capture: (data) => ipcRenderer.invoke('capture', data),
  saveImageAs: (data) => ipcRenderer.invoke('save-image-as', data),
});
