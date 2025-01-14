<script setup lang="ts">
import AskAI from '~/components/AskAI.vue'

const colorMode = useColorMode()
const color = computed(() => colorMode.value === 'dark' ? '#111827' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: '%s - Arnav Sudhansh',
  ogImage: 'https://arnav.blog/social-card.png',
  twitterImage: 'https://arnav.blog/social-card.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <NuxtLoadingIndicator />
    <AppHeader />
    <NuxtPage />
    <AskAI />
    <AppFooter />
    <UNotifications />
  </div>
</template>
