<script setup>
const isLoading = ref(true)
const calendlyWidget = ref(null)

const calendlyUrl = computed(() => {
  const backgroundColor = '#eef7fc'
  const primaryColor = '#3597d4'
  return `https://calendly.com/arnavs/45min?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=${backgroundColor}&primary_color=${primaryColor}`
})

function loadCalendlyWidget() {
  const script = document.createElement('script')
  script.src = 'https://assets.calendly.com/assets/external/widget.js'
  script.async = true
  script.onload = () => {
    isLoading.value = false
  }
  calendlyWidget.value?.appendChild(script)
}

onMounted(() => {
  loadCalendlyWidget()
})

useHead({
  title: 'Arnav Sudhansh | Contact',
  meta: [
    { name: 'description', content: 'Arnav Sudhansh — strategist · developer · problem solver' },
    { name: 'theme-color', content: '#eef7fc' }
  ]
})
</script>

<template>
  <main class="min-h-screen bg-white dark:bg-gray-900">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h2 class="text-3xl font-serif mb-4 text-gray-900 dark:text-white">Reach Out</h2>
        <h6 class="text-lg text-gray-600 dark:text-gray-400">
          Ready to Collaborate? 🤝 Block my Time!! 🗓️
        </h6>
      </div>

      <!-- Loading animation -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center h-64">
        <div class="relative text-5xl text-primary-500">
          <i class="mdi mdi-timer-sand"></i>
          <div class="absolute top-1/2 left-1/2 w-0.5 h-6 bg-primary-500 origin-top animate-sand-flow"></div>
        </div>
        <span class="mt-4 text-gray-600 dark:text-gray-400">Getting my schedule for you...</span>
      </div>

      <!-- Calendly inline widget -->
      <div
        v-show="!isLoading"
        class="calendly-inline-widget bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        ref="calendlyWidget"
        :data-url="calendlyUrl"
        style="min-width: 320px; height: 700px"
      ></div>

      <!-- Divider -->
      <div class="w-full border-t border-gray-200 dark:border-gray-700 my-12"></div>

      <!-- Contact Form -->
      <div class="w-full">
        <Contact data-aos="fade-in" class="mt-8" />
      </div>
    </div>
  </main>
</template>

<style>
@keyframes sand-flow {
  0%, 100% { transform: translate(-50%, -50%) scaleY(0); }
  50% { transform: translate(-50%, -50%) scaleY(1); }
}

.animate-sand-flow {
  animation: sand-flow 2s ease-in-out infinite;
}
</style>
