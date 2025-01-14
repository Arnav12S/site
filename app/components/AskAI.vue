<template>
  <div>
    <!-- Chatbot Button -->
    <button
      class="fixed bottom-5 right-5 bg-white text-primary border-2 border-primary rounded-full w-16 h-16 cursor-pointer shadow-md flex items-center justify-center transition-all duration-200 hover:bg-primary hover:text-white md:w-20 md:h-20"
      @click="toggleChatbot"
      aria-label="Open ArnavAI Bot"
    >
      <UIcon 
        name="i-lucide-message-circle" 
        class="w-8 h-8 md:w-10 md:h-10" 
        aria-label="Bot Avatar" 
      />
    </button>

    <!-- Chatbot Widget -->
    <div
      v-if="isChatbotOpen"
      class="fixed bottom-20 right-5 w-full max-w-md h-5/6 bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col overflow-hidden transition-transform duration-300 ease-in-out transform md:right-10"
    >
      <!-- Header -->
      <div class="bg-primary text-black p-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <UIcon 
            name="i-lucide-message-circle" 
            class="w-6 h-6 text-black" 
            aria-label="Bot Avatar" 
          />
          <span class="font-semibold">ArnavAI Bot</span>
        </div>
        <div class="flex items-center gap-2">
          <button 
            class="p-2 rounded-md hover:bg-white/20 transition-colors"
            @click="resetChat" 
            title="Reset chat"
          >
            <UIcon name="i-heroicons-arrow-path" />
          </button>
          <button 
            class="p-2 rounded-md hover:bg-white/20 transition-colors"
            @click="toggleChatbot" 
            title="Minimize chat"
          >
            <UIcon name="i-heroicons-minus-small" />
          </button>
        </div>
      </div>

      <!-- Conversation History -->
      <div class="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="[
            'flex mb-4',
            message.sender === 'bot' ? 'flex-row' : 'flex-row-reverse'
          ]"
        >
          <UIcon
            v-if="message.sender === 'bot'"
            name="i-lucide-message-circle"
            class="w-8 h-8 mx-2"
            aria-label="Bot Avatar"
          />
          <div class="max-w-[70%] mx-2">
            <div 
              :class="[
                'p-3 rounded-lg',
                message.sender === 'bot' 
                  ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white' 
                  : 'bg-primary text-black'
              ]"
            >
              <div v-if="message.options" class="space-y-2">
                <span>{{ message.text }}</span>
                <div class="flex flex-col gap-2 mt-3">
                  <button
                    v-for="(option, idx) in message.options"
                    :key="idx"
                    @click="handleOptionClick(option)"
                    class="text-left px-4 py-2 bg-white dark:bg-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-white text-sm border border-gray-200 dark:border-gray-600"
                  >
                    {{ option }}
                  </button>
                </div>
              </div>
              <div v-else>
                <span v-html="message.text"></span>
                <div v-if="message.isLoading" class="mt-2">
                  <span class="text-xs text-gray-500">Typing...</span>
                </div>
              </div>
            </div>
            <div class="text-xs text-gray-500 mt-1">{{ message.time }}</div>
          </div>
        </div>
      </div>

      <!-- User Input -->
      <div class="flex items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 gap-2">
        <input
          type="text"
          v-model="userMessage"
          placeholder="Enter your message"
          @keyup="handleKeyup"
          class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-primary dark:bg-gray-700 dark:text-white"
        />
        <button 
          @click="sendMessage" 
          :disabled="loading"
          class="p-2 bg-primary text-black rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send message"
        >
          <UIcon name="i-heroicons-paper-airplane" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isChatbotOpen = ref(false)
const messages = ref([])
const userMessage = ref('')
const loading = ref(false)

// Toggle chatbot visibility
const toggleChatbot = () => {
  isChatbotOpen.value = !isChatbotOpen.value
}

// Reset chat
const resetChat = () => {
  messages.value = []
  initialMessage()
}

// Initial message
const initialMessage = () => {
  messages.value.push({
    sender: 'bot',
    text: "Hello! I'm a chatbot. How can I help you today?",
    time: new Date().toLocaleTimeString()
  });
}

// Add new function for API call
const queryAI = async (userInput) => {
  try {
    const response = await fetch(`https://ai.arnav.blog/query?q=${encodeURIComponent(userInput)}`, {
      method: 'GET',
    })
    const data = await response.json()
    // Handle the nested response structure and format with line breaks
    const formattedResponse = data?.response?.response?.replace(/\n/g, '<br>') || 'Sorry, I could not generate a response.'
    return formattedResponse
  } catch (error) {
    console.error('Error querying AI:', error)
    return 'Sorry, I encountered an error. Please try again.'
  }
}

// Update sendMessage function
const sendMessage = async () => {
  const messageContent = userMessage.value.trim()
  if (messageContent === '') return

  // Add user message
  messages.value.push({
    sender: 'user',
    text: messageContent,
    time: new Date().toLocaleTimeString()
  })
  userMessage.value = ''

  // Add loading message
  const loadingMessageIndex = messages.value.push({
    sender: 'bot',
    text: '',
    isLoading: true,
    time: new Date().toLocaleTimeString()
  }) - 1

  loading.value = true
  
  // Get AI response
  const aiResponse = await queryAI(messageContent)
  
  // Update loading message with actual response
  messages.value[loadingMessageIndex] = {
    sender: 'bot',
    text: aiResponse,
    time: new Date().toLocaleTimeString()
  }
  
  loading.value = false
}

// Trigger sendMessage on Enter
const handleKeyup = (event) => {
  if (event.key === 'Enter') {
    sendMessage()
  }
}

// Initialize chat on mounted
onMounted(() => {
  initialMessage()
})
</script>

<style scoped>
.fixed::-webkit-scrollbar {
  width: 8px;
}
.fixed::-webkit-scrollbar-track {
  background: transparent;
}
.fixed::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
</style>
