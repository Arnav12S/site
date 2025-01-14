<template>
  <div class="min-h-screen">
    <!-- Main Navigation from app.vue -->
    <slot />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-12 gap-8">
        <!-- Main Content -->
        <main class="col-span-12 lg:col-span-9">
          <slot name="content" />
          
          <!-- Project Navigation -->
          <div class="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <div class="flex justify-between items-center">
              <UButton
                v-if="prevProject"
                :to="prevProject._path"
                variant="ghost"
                color="gray"
                class="group"
              >
                <template #leading>
                  <UIcon name="i-lucide-arrow-left" />
                </template>
                <span class="text-sm">
                  Previous:<br>
                  <span class="text-primary group-hover:underline">{{ prevProject.title }}</span>
                </span>
              </UButton>
              <div v-else class="w-24" /> <!-- Spacer -->

              <UButton
                v-if="nextProject"
                :to="nextProject._path"
                variant="ghost"
                color="gray"
                class="group"
              >
                <span class="text-sm text-right">
                  Next:<br>
                  <span class="text-primary group-hover:underline">{{ nextProject.title }}</span>
                </span>
                <template #trailing>
                  <UIcon name="i-lucide-arrow-right" />
                </template>
              </UButton>
              <div v-else class="w-24" /> <!-- Spacer -->
            </div>
          </div>
        </main>

        <!-- Table of Contents Sidebar -->
        <aside class="hidden lg:block col-span-3">
          <div class="sticky top-8">
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
              On this page
            </h3>
            <nav class="space-y-1">
              <ContentToc />
            </nav>

            <!-- Project Metadata -->
            <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
                Project Info
              </h3>
              <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p v-if="currentProject?.date">
                  <UIcon name="i-lucide-calendar" class="inline-block mr-2" />
                  {{ new Date(currentProject.date).toLocaleDateString() }}
                </p>
                <p v-if="currentProject?.category">
                  <UIcon name="i-lucide-folder" class="inline-block mr-2" />
                  {{ currentProject.category }}
                </p>
                <p v-if="currentProject?.tags?.length">
                  <UIcon name="i-lucide-tag" class="inline-block mr-2" />
                  {{ currentProject.tags.join(', ') }}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { data: projects } = await useAsyncData('project-list', () => queryContent('projects').find())
const { data: currentProject } = await useAsyncData(`project-${route.params.slug}`, () => 
  queryContent('projects', route.params.slug).findOne()
)

// Find current project index
const currentIndex = projects.value?.findIndex(p => p._path === currentProject.value?._path) ?? -1

// Get prev and next projects
const prevProject = currentIndex > 0 ? projects.value[currentIndex - 1] : null
const nextProject = currentIndex < (projects.value?.length ?? 0) - 1 ? projects.value[currentIndex + 1] : null
</script>
