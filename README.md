# Electron Camera - 摄像头悬浮窗口应用

一个基于 Electron + Vue + TypeScript 开发的摄像头悬浮窗口应用，支持实时摄像头预览、滤镜效果和自定义窗口样式。

## ✨ 功能特性

- **🎥 实时摄像头预览** - 显示电脑摄像头的实时视频流
- **🔮 滤镜效果** - 支持一键模糊/取消模糊摄像头画面
- **⌨️ 自定义快捷键** - 可配置快捷键快速切换滤镜效果
- **🪟 悬浮窗口** - 透明无边框窗口，可置顶显示
- **⚙️ 自定义设置** - 支持多种窗口样式调整：
  - 窗口透明度调节 (1-100%)
  - 窗口圆角大小调节 (1-100%)
  - 窗口大小调节 (1-100%)
  - 始终置顶开关
- **💾 配置保存** - 自动保存用户设置，重启应用后恢复
- **📌 系统托盘** - 最小化到系统托盘，方便快速访问
- **🎯 圆形显示** - 默认圆形摄像头预览，美观简洁

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm (推荐) 或 npm

### 安装依赖

```bash
pnpm install
```

### 开发模式运行

```bash
pnpm dev
```

### 构建应用

```bash
# Windows
pnpm build:win

# macOS
pnpm build:mac

# Linux
pnpm build:linux
```

## 🎮 使用方法

1. **启动应用**：运行应用后，会在屏幕中央显示一个圆形摄像头窗口
2. **打开设置**：右键点击系统托盘图标 → 选择"设置"
3. **调整设置**：
   - 拖动滑块调整窗口透明度、圆角、大小
   - 设置自定义快捷键（支持Ctrl/Shift组合键）
   - 勾选"始终置顶"让窗口保持在最前面
   - 点击"保存"保存设置
4. **使用快捷键**：按设置的快捷键（默认Ctrl+M）切换模糊滤镜
5. **关闭窗口**：通过托盘菜单退出应用

## 🎯 快捷键功能

- **默认快捷键**: `Ctrl + M` - 切换摄像头模糊滤镜
- **自定义设置**: 可在设置界面修改为任意组合键
- **支持格式**: `ctrl+key`, `shift+key` 等组合键

## 🛠️ 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Electron + Vite
- **样式**: Tailwind CSS
- **包管理**: pnpm
- **代码质量**: ESLint + Prettier

## 📁 项目结构

```
electron-camera/
├── src/
│   ├── main/           # Electron 主进程
│   │   └── index.ts    # 主进程入口，窗口管理、IPC通信和快捷键注册
│   ├── preload/        # 预加载脚本
│   │   └── index.ts    # IPC通信桥接，暴露API给渲染进程
│   └── renderer/       # 渲染进程 (Vue应用)
│       ├── components/ # Vue组件
│       │   ├── Settings.vue    # 设置组件（包含快捷键设置）
│       │   └── VideoWin.vue    # 视频窗口组件（支持滤镜效果）
│       ├── types/      # TypeScript类型定义
│       │   └── index.ts        # SettingsOptions接口定义
│       └── App.vue     # 根组件
├── build/              # 构建输出目录
├── resources/          # 应用资源文件
└── package.json        # 项目配置
```

## 🔧 配置说明

应用设置保存在用户数据目录的 `settings.json` 文件中：
- Windows: `%APPDATA%/electron-camera/settings.json`
- macOS: `~/Library/Application Support/electron-camera/settings.json`
- Linux: `~/.config/electron-camera/settings.json`

配置文件包含以下设置项：
```json
{
  "windowOpacity": 100,    // 窗口透明度 (1-100)
  "alwaysOnTop": true,     // 是否置顶
  "rounded": 50,           // 圆角大小 (1-100)
  "winSize": 30,           // 窗口大小 (1-100)
  "keyBlur": "ctrl+m"      // 模糊滤镜快捷键
}
```

## 🤝 开发贡献

欢迎提交 Issue 和 Pull Request！

### 开发规范

1. 代码遵循 ESLint + Prettier 规范
2. 使用 TypeScript 确保类型安全
3. 提交前运行 `pnpm format` 和 `pnpm lint`

## 📄 许可证

MIT License

## 🙏 致谢

- [Electron](https://www.electronjs.org/) - 跨平台桌面应用框架
- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [electron-vite](https://electron-vite.org/) - Electron + Vite 开发工具链

---

如有问题或建议，请提交 [Issue](https://github.com/zhangyu-521/electron-camera/issues)。
