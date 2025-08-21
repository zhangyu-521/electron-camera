import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  showContentMenu: (x: number, y: number) => {
    console.log('preload', x, y)
    ipcRenderer.invoke('show-content-menu', x, y)
  },

  noticeSettings: (setting) => {
    return ipcRenderer.invoke('notice-settings', setting)
  },

  saveSettings: (setting) => {
    return ipcRenderer.invoke('save-settings', setting)
  },

  onVideoSettings: (callback: (setting: object) => void) => {
    ipcRenderer.on('video-settings', (_, setting) => {
      callback(setting)
    })
  },

  onWindowConfig: (callback: (config: object) => void) => {
    ipcRenderer.on('window-config', (_, config) => {
      callback(config)
    })
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
