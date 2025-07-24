const { contextBridge, ipcRenderer } = require('electron')

// 安全的API暴露给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),
  
  // 平台信息
  platform: process.platform,
  
  // 最小化窗口
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  
  // 最大化/还原窗口
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  
  // 关闭窗口
  closeWindow: () => ipcRenderer.send('close-window'),
  
  // 打开外部链接
  openExternal: (url) => ipcRenderer.send('open-external', url)
})

// 监听窗口事件
window.addEventListener('DOMContentLoaded', () => {
  console.log('Electron preload script loaded')
})