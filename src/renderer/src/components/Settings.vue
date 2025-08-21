<script setup lang="ts">
import { toRaw, watch, ref, onMounted } from 'vue'
import { SettingsOptions } from '@renderer/types/index'

const settingsOption = ref<SettingsOptions>({
  windowOpacity: 100,
  alwaysOnTop: true,
  rounded: 50,
  winSize: 30
})

const saveStatus = ref(false)

const saveSettings = async (): Promise<void> => {
  // 保存设置的逻辑
  const result = await window.api.saveSettings(toRaw(settingsOption.value))
  console.log('result', result)
  if (result) {
    saveStatus.value = true
    setTimeout(() => {
      saveStatus.value = false
    }, 2000)
  }
}

watch(
  settingsOption,
  (newSettings) => {
    window.api.noticeSettings(toRaw(newSettings))
  },
  { deep: true }
)

const closeSettings = (): void => {
  // 通过IPC通知主进程关闭设置窗口
  if (window.electron && window.electron.ipcRenderer) {
    window.electron.ipcRenderer.send('close-settingsOption-window')
  } else {
    window.close() // 备用方案
  }
}

onMounted(() => {
  // 监听窗口配置事件
  if (window.api && window.api.onWindowConfig) {
    window.api.onWindowConfig((config) => {
      settingsOption.value = config
    })
  }
})
</script>

<template>
  <div
    style="padding: 20px"
    class="h-full w-full flex flex-col gap-5 bg-white rounded-lg shadow-lg"
  >
    <div class="setting-item">
      <label class="block text-sm font-medium mb-2">圆角: {{ settingsOption.rounded }}%</label>
      <input v-model="settingsOption.rounded" type="range" min="1" max="100" class="w-full" />
    </div>

    <div class="setting-item">
      <label class="block text-sm font-medium mb-2">窗口大小: {{ settingsOption.winSize }}%</label>
      <input v-model="settingsOption.winSize" type="range" min="1" max="100" class="w-full" />
    </div>

    <div class="setting-item">
      <label class="block text-sm font-medium mb-2"
        >窗口透明度: {{ settingsOption.windowOpacity }}%</label
      >
      <input v-model="settingsOption.windowOpacity" type="range" min="1" max="100" class="w-full" />
    </div>

    <div class="setting-item">
      <label class="flex items-center">
        <input v-model="settingsOption.alwaysOnTop" type="checkbox" class="mr-2" />
        始终置顶
      </label>
    </div>

    <div class="flex gap-5">
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        @click="saveSettings"
      >
        保存
      </button>
      <p v-if="saveStatus" class="bg-green-400">√保存成功</p>
      <button
        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        @click="closeSettings"
      >
        关闭
      </button>
    </div>
  </div>
</template>
