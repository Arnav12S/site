<template>
  <UContainer>
    <div v-if="page" class="min-h-screen flex flex-col justify-between p-4">
      <div class="w-full p-8 box-border">
        <!-- Header -->
        <div class="flex justify-between items-center">
          <div class="w-[2.5cm] h-[3cm] rounded-2xl overflow-hidden">
            <img :src="page.header.image" :alt="page.header.name" class="w-full h-full object-cover">
          </div>
          <div class="flex-grow pl-4">
            <h1 class="text-2xl text-blue-600 mb-2">{{ page.header.name }}</h1>
            <div class="text-sm text-gray-600">
              <span v-for="(item, index) in page.header.contact" 
                    :key="index" 
                    class="inline-flex items-center gap-1 mr-4">
                <a :href="item.url" 
                   target="_blank" 
                   class="flex items-center text-blue-600 hover:underline">
                  <UIcon :name="item.icon" class="w-5 h-5 mr-1" />
                  {{ item.text }}
                </a>
              </span>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="mt-6">
          <h2 class="text-xl font-semibold text-blue-600 my-4">Summary</h2>
          <p class="text-base leading-7">{{ page.summary }}</p>
        </div>

        <!-- Experience -->
        <div class="mt-6">
          <h2 class="text-xl font-semibold text-blue-600 my-4">{{ page.experience.title }}</h2>
          <div v-for="(job, index) in page.experience.items" :key="index" class="mb-4">
            <div class="flex justify-between items-baseline mb-0">
              <h3 class="text-lg font-semibold text-blue-700">
                {{ job.title }}
                <template v-if="job.company">
                  | <a :href="`https://${job.company.toLowerCase()}.com`" 
                       target="_blank" 
                       class="text-blue-600 hover:underline">
                    {{ job.company }}
                  </a>
                </template>
              </h3>
              <span class="text-sm text-gray-600 italic">{{ job.date }}, {{ job.location }}</span>
            </div>
            <ul class="list-disc pl-5 text-base leading-7">
              <li v-for="(detail, detailIndex) in job.details" 
                  :key="detailIndex">
                {{ detail }}
              </li>
            </ul>
            
          </div>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('cv', () => queryContent('/cv').findOne())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description
})
</script>

<!-- Remove all custom CSS -->