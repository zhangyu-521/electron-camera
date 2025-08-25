import { app, shell, BrowserWindow, Tray, Menu, ipcMain, globalShortcut } from 'electron'
import { join } from 'path'
import fs from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let settingsWindow: BrowserWindow | null = null
let videoWindow: BrowserWindow | null = null

// 读取配置文件 - 使用用户数据目录而不是应用目录
const settingsPath = join(app.getPath('userData'), 'settings.json')
let settings = {
  windowOpacity: 100,
  alwaysOnTop: true,
  rounded: 50,
  winSize: 30,
  keyBlur: 'ctrl+m'
}
if (fs.existsSync(settingsPath)) {
  try {
    const settingsData = fs.readFileSync(settingsPath, 'utf-8')
    settings = JSON.parse(settingsData)
  } catch (error) {
    console.error('读取配置文件失败:', error)
  }
}

function createVideoWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 300,
    show: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false
    }
  })

  mainWindow.setAspectRatio(1)

  mainWindow.on('ready-to-show', () => {
    sendSettingToWindow(mainWindow, 'video')
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  videoWindow = mainWindow
}

function settingWindow(): void {
  // 检查设置窗口是否已经存在且未被销毁
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    // 如果窗口存在，聚焦到它
    settingsWindow.focus()
    return
  }

  // 创建新的设置窗口
  settingsWindow = new BrowserWindow({
    width: 400,
    height: 500,
    show: false,
    resizable: true,
    autoHideMenuBar: true,
    title: '设置',
    icon,
    frame: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false
    }
  })

  settingsWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  settingsWindow.on('ready-to-show', () => {
    sendSettingToWindow(settingsWindow!)
    settingsWindow!.show()
  })

  // 窗口关闭时清理引用
  settingsWindow.on('closed', () => {
    settingsWindow = null
  })

  ipcMain.on('close-settingsOption-window', () => {
    console.log('close-settingsOption-window')
    if (settingsWindow && !settingsWindow.isDestroyed()) {
      settingsWindow.close()
    }
  })

  // 加载相同的index.html，但添加查询参数来显示设置界面
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    settingsWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}?view=settings`)
  } else {
    settingsWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      query: { view: 'settings' }
    })
  }
}

function sendSettingToWindow(window: BrowserWindow, view?: string): void {
  if (!window) return
  window.webContents.send('window-config', settings)

  if (view === 'video') {
    window.setAlwaysOnTop(settings.alwaysOnTop)
    window.setContentSize(1000 * settings.winSize * 0.01, 1000 * settings.winSize * 0.01)
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electronCamera.app')

  globalShortcut.register(settings.keyBlur, () => {
    if (videoWindow) {
      videoWindow.webContents.send('toggle-filetr')
    }
  })

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createTray()
  createVideoWindow()

  ipcMain.handle('notice-settings', (_, settings) => {
    if (!videoWindow?.isDestroyed()) {
      videoWindow!.setAlwaysOnTop(settings.alwaysOnTop)
      videoWindow!.setContentSize(1000 * settings.winSize * 0.01, 1000 * settings.winSize * 0.01)
      videoWindow!.webContents.send('video-settings', settings)
    }
  })

  ipcMain.handle('save-settings', (_, curretntSettings) => {
    if (curretntSettings.keyBlur != settings.keyBlur) {
      globalShortcut.unregister(settings.keyBlur)
      globalShortcut.register(curretntSettings.keyBlur, () => {
        if (videoWindow) {
          videoWindow.webContents.send('toggle-filetr')
        }
      })
    }
    const settingsPath = join(app.getPath('userData'), 'settings.json')
    fs.writeFileSync(settingsPath, JSON.stringify(curretntSettings), { flag: 'w' })
    return true
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createVideoWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 创建托盘
function createTray(): void {
  let tray: Tray | null = null
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '设置',
      click: function () {
        settingWindow()
        console.log(456)
      }
    },
    {
      // 点击退出菜单退出程序
      label: '退出',
      click: function () {
        console.log(123)
        app.quit()
      }
    }
  ])
  tray.setToolTip('electron-camera')
  tray.setContextMenu(contextMenu) // 设置图标的内容菜单
}
