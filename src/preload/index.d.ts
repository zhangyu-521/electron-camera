import { ElectronAPI } from '@electron-toolkit/preload'
import { SettingsOptions } from '@renderer/types'

interface Api {
  showContentMenu: (x: number, y: number) => void
  onWinDowMoved: (callback: (flag: boolean) => void) => void
  noticeSettings: (setting: SettingsOptions) => void
  saveSettings: (setting: SettingsOptions) => boolean
  onVideoSettings: (callback: (setting: SettingsOptions) => void) => void
  onWindowConfig: (callback: (config: SettingsOptions) => void) => void
  onVideoFilter: (callback: () => void) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
