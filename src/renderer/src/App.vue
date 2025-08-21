<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Settings from './components/Settings.vue'
import VideoWin from './components/VideoWin.vue'
const showSettings = ref(false)

// 监听URL参数来判断是否显示设置界面
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('view') === 'settings') {
    showSettings.value = true
  }
})
</script>

<template>
  <div v-if="showSettings" class="w-full h-full">
    <Settings />
  </div>
  <div v-else class="w-full h-full">
    <VideoWin />
  </div>
</template>
