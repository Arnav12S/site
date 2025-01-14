<template>
  <div class="flex items-center gap-2">
    <UButton 
      @click="toggleDrawer" 
      color="gray"
      variant="ghost"
      aria-label="Open search"
      class="flex items-center gap-2"
    >
      <UIcon name="i-lucide-search" />
      <ClientOnly>
        <kbd class="hidden md:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
          <span v-if="isMac">⌘</span>
          <span v-else>Ctrl</span>
          <span>K</span>
        </kbd>
      </ClientOnly>
    </UButton>

    <SearchDrawer :isOpen="isDrawerOpen" @close="isDrawerOpen = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import SearchDrawer from './SearchDrawer.vue'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 640)
const isDrawerOpen = ref(false)
const isMac = ref(false)

// Move platform check to onMounted to ensure it only runs on client
onMounted(() => {
  isMac.value = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  window.addEventListener('keydown', keydownHandler)
})

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}

const openDrawer = () => {
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
}

// Keyboard shortcuts
const keydownHandler = (event) => {
  const ctrlKey = isMac.value ? event.metaKey : event.ctrlKey

  if (ctrlKey && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    openDrawer()
  }
}

onUnmounted(() => {
  window.removeEventListener('keydown', keydownHandler)
})
</script>

<style scoped>
/* Add any necessary styles here */
</style>
