<template>
  <main class="flex items-center">
    <ClientOnly>
      <div class="max-w-[17em] md:max-w-xs">
        <div v-if="spotify?.isPlaying" class="flex items-start gap-4">
          <div class="flex flex-col gap-1">
            <!-- Album Cover -->
            <img
              :src="spotify.albumImageUrl"
              :alt="spotify.album"
              class="w-12 h-12 object-cover rounded"
            />
            <span class="text-[10px] text-neutral">Control for fun</span>
          </div>

          <!-- Song Details and Controls -->
          <div class="flex flex-col">
            <div class="flex items-center gap-1.5 mb-1">
              <UIcon
                name="i-simple-icons-spotify"
                class="w-3 h-3 text-emerald-600"
              />
              <span class="text-[10px] text-neutral">Now Listening to</span>
            </div>
            <h5 class="text-sm truncate">
              <a
                rel="noopener noreferrer"
                class="text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors duration-300"
                :href="spotify.songUrl"
                target="_blank"
              >
                <span :title="spotify.title">{{ spotify.title }}</span>
              </a>
            </h5>
            <h5 class="text-xs text-neutral truncate mb-2">
              <span :title="spotify.artist">{{ spotify.artist || 'Unknown' }}</span>
            </h5>

            <!-- Playback Controls -->
            <div class="flex items-center gap-1">
              <UButton
                variant="ghost"
                color="gray"
                icon="i-mdi-skip-previous"
                size="xs"
                @click="controlPlayback('previous')"
              />
              <UButton
                variant="ghost"
                color="gray"
                :icon="spotify.isPlaying ? 'i-mdi-pause' : 'i-mdi-play'"
                size="xs"
                @click="togglePlayPause"
              />
              <UButton
                variant="ghost"
                color="gray"
                icon="i-mdi-skip-next"
                size="xs"
                @click="controlPlayback('next')"
              />
            </div>
          </div>
        </div>

        <div v-else class="flex items-center gap-2">
          <UIcon
            name="i-simple-icons-spotify"
            class="w-5 h-5 text-neutral"
          />
          <div class="flex flex-col">
            <h5 class="text-sm truncate">
              <a 
                href="https://open.spotify.com/user/arnav.sudhansh" 
                target="_blank"
                class="text-neutral hover:text-secondary transition-colors duration-300"
              >
                Spotify &mdash; Not playing
              </a>
            </h5>
            <h5 class="text-xs text-gray-500 truncate">
              {{ spotify?.lastPlayedAt ? getRelativeTime(spotify.lastPlayedAt) : 'No recent activity' }}
            </h5>
          </div>
        </div>
      </div>
    </ClientOnly>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getRelativeTime } from '~/utils/date'

const spotify = ref(null)
let ws = null
const MAX_RECONNECT_DELAY = 5000
let reconnectTimeout = null

const connectWebSocket = () => {
  // Clear any existing connection first
  if (ws) {
    ws.close()
    ws = null
  }

  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
    reconnectTimeout = null
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const wsUrl = `${protocol}//${window.location.host}/api/spotify`

  ws = new WebSocket(wsUrl)

  ws.onopen = () => {
    console.log('WebSocket connection established')
  }

  ws.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data)
      console.log('Received message:', message)
      if (message.type === 'spotify_update') {
        spotify.value = message.data
        console.log('Spotify state updated:', message.data)
      }
    } catch (error) {
      console.error('WebSocket message parsing error:', error)
    }
  }

  ws.onclose = (event) => {
    console.warn(`WebSocket closed (Code: ${event.code}). Attempting to reconnect...`)
    clearTimeout(reconnectTimeout)
    reconnectTimeout = setTimeout(connectWebSocket, MAX_RECONNECT_DELAY)
  }

  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
    ws.close()
  }
}

const controlPlayback = async (action) => {
  if (ws?.readyState === WebSocket.OPEN) {
    console.log(`Sending playback control action: ${action}`)
    ws.send(JSON.stringify({
      type: 'playback_control',
      action
    }))
  } else {
    console.warn('WebSocket is not open. Cannot send playback control action.')
  }
}

const togglePlayPause = () => {
  controlPlayback(spotify.value?.isPlaying ? 'pause' : 'play')
}

onMounted(() => {
  connectWebSocket()
})

onUnmounted(() => {
  if (ws) {
    clearTimeout(reconnectTimeout)
    ws.close()
    console.log('WebSocket connection closed by client')
  }
})
</script>

<style scoped>
/* Optional: Add any additional styles if necessary */
</style>