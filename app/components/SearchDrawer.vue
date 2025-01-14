<template>
  <Transition name="fade">
    <div v-if="isOpen" 
      class="fixed inset-0 z-30 flex justify-center items-start pt-[10vh] backdrop-blur-sm bg-black/20 dark:bg-black/40"
      @click.self="closeDrawer"
      @keydown="handleKeydown"
    >
      <div class="bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-lg w-11/12 max-w-lg p-6 relative focus:outline-none shadow-lg border border-gray-200 dark:border-gray-700"
        tabindex="-1"
        ref="drawer"
      >
        <!-- Search Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-search" class="w-5 h-5 text-gray-400" />
            <span class="text-sm text-gray-500">Search content and navigation</span>
          </div>
          
          <!-- Keyboard Shortcuts -->
          <div class="hidden sm:flex items-center gap-2">
            <kbd class="px-2 py-1 text-xs font-semibold bg-gray-100 border rounded-md dark:bg-gray-800 dark:border-gray-700">
              esc
            </kbd>
            <span class="text-xs text-gray-500">to close</span>
          </div>
        </div>

        <!-- Search Input -->
        <div class="relative">
          <input 
            type="text" 
            v-model="searchQuery" 
            ref="searchInput"
            class="w-full px-4 py-2 pl-10 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            :placeholder="isSearching ? 'Search content...' : 'Type to search or use shortcuts...'"
            @input="performSearch"
          />
          <UIcon 
            :name="isSearching ? 'i-lucide-search' : 'i-lucide-command'" 
            class="absolute left-3 top-3 w-4 h-4 text-gray-400"
          />
        </div>

        <!-- Quick Navigation or Search Results -->
        <ul class="space-y-1 max-h-[60vh] overflow-y-auto">
          <li 
            v-for="(item, index) in filteredItems" 
            :key="index"
            :class="[
              'p-2 rounded-md cursor-pointer flex items-center justify-between',
              currentIndex === index ? 'bg-primary-50 dark:bg-primary-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
            ]"
            @click="selectItem(item)"
            @mouseover="currentIndex = index"
          >
            <div class="flex items-center gap-2">
              <UIcon :name="item.icon" class="w-4 h-4 text-gray-500" />
              <span>{{ item.text }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="item.type" 
                :class="[
                  'text-xs px-2 py-1 rounded',
                  item.type === 'blog' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' : 
                  item.type === 'project' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
                ]"
              >
                {{ item.type }}
              </span>
              <kbd v-if="!isSearching && item.shortcut" 
                class="hidden sm:inline-block px-2 py-1 text-xs font-semibold bg-gray-100 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              >
                ⌘{{ item.shortcut }}
              </kbd>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useContent, useAsyncData, useLazyFetch } from '#imports'

// Fetch content and navigation
const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())
const { data: files } = useLazyFetch('/api/search.json', { default: () => [] })

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])
const searchQuery = ref('')
const currentIndex = ref(-1)
const isSearching = ref(false)

// Quick navigation items with shortcuts
const quickNavItems = [
  { text: 'Home', to: '/', shortcut: '1', icon: 'i-lucide-home' },
  { text: 'Projects', to: '/projects', shortcut: '2', icon: 'i-lucide-folder' },
  { text: 'Explore', to: '/explore', shortcut: '3', icon: 'i-lucide-compass' },
  { text: 'CV', to: '/cv', shortcut: '4', icon: 'i-lucide-file-text' },
  { text: 'Blog', to: '/blog', shortcut: '5', icon: 'i-lucide-pen-tool' },
  { text: 'Contact', to: '/contact', shortcut: '6', icon: 'i-lucide-mail' }
]

// Modified performSearch function to use Nuxt UI's search capabilities
const performSearch = () => {
  if (searchQuery.value.trim() === '') {
    isSearching.value = false
    filteredItems.value = quickNavItems
  } else {
    isSearching.value = true
    // Use Nuxt Content's search functionality
    filteredItems.value = files.value
      .filter(item => {
        const searchLower = searchQuery.value.toLowerCase()
        return (
          item.title?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower)
        )
      })
      .map(item => ({
        text: item.title,
        to: item._path,
        icon: getIconForContentType(item._path),
        type: getContentType(item._path)
      }))
  }
  currentIndex.value = -1
}

// Helper functions for content types and icons
const getContentType = (path) => {
  if (path.startsWith('/blog')) return 'blog'
  if (path.startsWith('/projects')) return 'project'
  return 'page'
}

const getIconForContentType = (path) => {
  if (path.startsWith('/blog')) return 'i-lucide-pen-tool'
  if (path.startsWith('/projects')) return 'i-lucide-folder'
  return 'i-lucide-file-text'
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 