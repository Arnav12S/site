<script setup lang="ts">
import type { NavItem } from '@nuxt/content'
import SearchButton from '~/components/SearchButton.vue'

const nav = ref(false)

const navLinks = [
  { to: '/', text: 'Home' },
  { to: '/projects', text: 'Projects' },
  { to: '/explore', text: 'Explore' },
  { to: '/cv', text: 'CV' },
  { to: '/blog', text: 'Blog' },
  { to: '/contact', text: 'Contact' }
]

// Lock body scroll when nav is open
watch(nav, (newVal) => {
  document.body.style.overflow = newVal ? 'hidden' : 'auto'
})
</script>

<template>
  <nav 
    v-if="$route.meta.title !== 'notfound'" 
    class="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm py-6 px-6 sm:px-8 lg:px-10 max-w-8xl mx-auto"
  >
    <div class="flex justify-between items-center gap-12 max-w-4xl mx-auto">
      <!-- Logo -->
      <nuxt-link to="/" class="flex-shrink-0">
        <img 
          draggable="false" 
          class="w-20 h-15 hidden dark:block" 
          src="/logo-dark.png" 
          alt="Arnav Sudhansh" 
        />
        <img 
          draggable="false" 
          class="w-20 h-15 block dark:hidden" 
          src="/logo-light.png" 
          alt="Arnav Sudhansh" 
        />
      </nuxt-link>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-6">
        <nuxt-link 
          v-for="link in navLinks" 
          :key="link.to" 
          :to="link.to"
          class="text-lg transition-colors duration-200 text-neutral hover:text-secondary [&.router-link-exact-active]:text-primary"
        >
          {{ link.text }}
        </nuxt-link>
        
        <SearchButton />
        <ThemeToggle />
      </div>

      <!-- Mobile Navigation Controls -->
      <div class="flex items-center md:hidden">
        <SearchButton />
        <ThemeToggle />
        <button 
          class="ml-2" 
          @click="nav = !nav"
          aria-label="Toggle navigation menu"
        >
          <UIcon 
            name="i-lucide-menu" 
            class="h-6 w-6 text-neutral dark:text-white" 
          />
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    <transition 
      enter-active-class="transition-opacity duration-200 ease-in"
      leave-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="nav" class="fixed inset-0 bg-white/95 dark:bg-neutral-950/95 z-20">
        <div class="p-6">
          <div class="flex justify-end mt-2">
            <button 
              class="md:hidden" 
              @click="nav = !nav"
              aria-label="Close navigation menu"
            >
              <UIcon 
                name="i-lucide-x" 
                class="h-6 w-6 text-neutral dark:text-white" 
              />
            </button>
          </div>

          <div class="mt-16">
            <div class="flex flex-col space-y-6">
              <nuxt-link 
                v-for="link in navLinks" 
                :key="link.to"
                :to="link.to" 
                @click="nav = !nav"
                class="text-4xl mb-4 transition-colors duration-200 text-neutral hover:text-secondary [&.router-link-exact-active]:text-primary"
              >
                {{ link.text }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>
