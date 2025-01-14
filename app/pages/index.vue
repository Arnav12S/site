<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  titleTemplate: '',
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description
})
</script>

<template>
  <NuxtLayout name="default">
    <UContainer>
      <div class="max-w-3xl mx-auto mt-24 mb-16">
        <div data-aos="fade-in">
          <h1 class="text-4xl font-bold text-primary mb-2">{{ page.hero.title }}</h1>
          <div class="mb-4">
            <h2 class="text-m font-bold md:text-xl md:font-normal text-neutral">
              {{ page.hero.description }}
            </h2>
          </div>
          
          <div class="text-neutral mb-8" v-html="page.hero.content" />
          
          <p class="text-primary font-medium mb-8">{{ page.sections[0].title }}</p>
        </div>

        <div class="space-y-2">
          <NuxtLink
            v-for="item in page.sections[0].items"
            :key="item.title"
            :to="item.to"
            data-aos="fade-up"
            class="block p-4 -mx-4 transition-all duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:translate-y-[-2px] rounded-lg"
          >
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <h3 class="text-lg font-medium text-primary">{{ item.title }}</h3>
              <p class="text-neutral text-sm sm:text-base">{{ item.description }}</p>
            </div>
          </NuxtLink>
        </div>

        <div class="flex justify-center mt-24 mb-16">
          <img
            draggable="false"
            loading="lazy"
            src="/polaroid.png"
            alt="me irl (fr)"
            class="w-64 rounded-lg"
          />
        </div>
      </div>
    </UContainer>
  </NuxtLayout>
</template>

<style scoped>
.landing-grid {
  background-size: 100px 100px;
  background-image:
    linear-gradient(to right, rgb(var(--color-gray-200)) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(var(--color-gray-200)) 1px, transparent 1px);
}
.dark {
  .landing-grid {
    background-image:
      linear-gradient(to right, rgb(var(--color-gray-800)) 1px, transparent 1px),
      linear-gradient(to bottom, rgb(var(--color-gray-800)) 1px, transparent 1px);
  }
}
</style>
