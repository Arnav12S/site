<template>
  <div class="w-full">
    <h5 class="text-2xl font-medium text-gray-900 dark:text-white mb-4">Message me</h5>
    <p class="text-gray-600 dark:text-gray-400 mb-8">
      Let me know what you think about this website! Or let's work on a project together!
      <span v-if="!submitted"> I'll try to get back to you as soon as possible. </span>
      Alternatively, you can email me at
      <a
        href="mailto:hi@arnav.blog?subject=Contacting%20You%20From%20Your%20Website&body=Hi%20Arnav,%0D%0A%0D%0AI%20want%20to%20talk%20about%20.....%0D%0A%0D%0AThanks!"
        target="_blank"
        class="text-primary-500 hover:text-primary-600 transition-colors"
      >
        hi@arnav.blog
      </a>.
    </p>

    <div class="w-full max-w-2xl">
      <form v-if="!submitted" @submit.prevent="submitForm" class="space-y-4">
        <input
          type="text"
          :disabled="loading"
          v-model="form.name"
          required
          placeholder="Name"
          class="w-full px-4 py-2 bg-white/20 dark:bg-white/10 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 transition duration-200"
        />
        <input
          type="email"
          v-model="form.email"
          required
          placeholder="Email"
          :disabled="loading"
          class="w-full px-4 py-2 bg-white/20 dark:bg-white/10 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 transition duration-200"
        />
        <textarea
          v-model="form.message"
          required
          placeholder="Anything you wanna say"
          :disabled="loading"
          class="w-full px-4 py-2 bg-white/20 dark:bg-white/10 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 transition duration-200 min-h-[150px] resize-y"
        />

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-2 bg-primary-500/20 text-primary-700 rounded-lg hover:bg-primary-500/30 disabled:bg-primary-500/20 disabled:cursor-wait transition-all duration-300 min-w-[120px]"
          >
            <span v-if="!loading">Send message</span>
            <div v-if="loading" class="w-5 h-5 border-2 border-primary-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </button>
        </div>
      </form>

      <div v-if="submitted" class="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
        <p class="text-lg text-green-700 dark:text-green-300">
          Thank you for the message! I'll get back to you as soon as possible.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const loading = ref(false)
const submitted = ref(false)
const error = ref(false)
const form = reactive({
  name: '',
  email: '',
  message: ''
})

const errormsg = 'An error occurred. Please try again, or message me on one of my socials instead.'

async function submitForm() {
  console.log('Form submission triggered')
  loading.value = true
  error.value = false

  try {
    const response = await fetch('/api/msg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
    
    const res = await response.json()
    if (res.error === false) {
      form.name = ''
      form.email = ''
      form.message = ''
      submitted.value = true
    } else {
      error.value = errormsg
    }
  } catch (err) {
    error.value = errormsg
  } finally {
    loading.value = false
  }
}
</script>
