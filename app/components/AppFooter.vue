<template>
  <div class="max-w-6xl mx-auto px-6">
    <div class="flex justify-between items-start md:flex-row flex-col gap-8">
      <div class="flex-1">
        <Spotify />
      </div>

      <div class="flex-1 flex justify-end">
        <div class="flex flex-col items-end">
          <div class="flex space-x-4">
            <a
              href="https://www.linkedin.com/in/arnav-sudhansh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              class="text-primary hover:opacity-60 transition-opacity duration-300"
            >
              <UIcon name="i-mdi-linkedin" />
            </a>

            <a
              href="https://github.com/arnav12s"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="GitHub Profile"
              class="text-primary hover:opacity-60 transition-opacity duration-300"
            >
              <UIcon name="i-mdi-github" />
            </a>

            <a
              href="mailto:hi@arnav.blog?subject=Contacting%20You%20From%20Your%20Website&body=Hi%20Arnav,%0D%0A%0D%0AI%20want%20to%20talk%20about%20xxxx.%0D%0A%0D%0AThanks!"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="Send Email"
              class="text-primary hover:opacity-60 transition-opacity duration-300"
            >
              <UIcon name="i-mdi-email" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

// No changes needed in script section
</script>

<style scoped>
/* Add any necessary styles here */
</style>
  