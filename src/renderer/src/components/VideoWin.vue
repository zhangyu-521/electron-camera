<script setup lang="ts">
import { SettingsOptions } from '@renderer/types'
import { onMounted, ref } from 'vue'

const video = ref<HTMLVideoElement | null>(null)
const container = ref<HTMLDivElement | null>(null)

window.api.onVideoSettings((settings: SettingsOptions) => {
  changeVideo(settings)
})

const changeVideo = (settings: SettingsOptions): void => {
  if (container.value) {
    container.value.style.opacity = settings.windowOpacity * 0.01 + ''
    container.value.style.borderRadius = settings.rounded + '%'
  }
  if (video.value) {
    video.value.style.borderRadius = settings.rounded + '%'
  }
}

onMounted(() => {
  // 监听窗口配置事件
  if (window.api && window.api.onWindowConfig) {
    window.api.onWindowConfig((config) => {
      changeVideo(config)
    })
  }

  window.api.onVideoFilter(() => {
    if (video.value) {
      if (video.value.style.filter) {
        video.value.style.filter = ''
      } else {
        video.value.style.filter = 'blur(50px)'
      }
    }
  })

  window.navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    if (video.value) {
      video.value.srcObject = stream
    }
  })
})
</script>

<template>
  <div ref="container" class="w-full rounded-[50%] h-full overflow-hidden op">
    <video ref="video" autoplay class="w-full h-full object-cover border-0 rounded-[50%]"></video>
  </div>
</template>
