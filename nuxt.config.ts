// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxthub/core',
    '@vueuse/nuxt'
  ],

  css: [
    '~/assets/css/main.css'
  ],

  future: {
    compatibilityVersion: 4
  },

  content: {
    database: {
      type: 'd1',
      binding: 'DB',
    },
    studio: {
      enabled: true,
    },
    build: {
      pathMeta: {
        forceLeadingSlash: true,
      },
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 3,
        },
        highlight: {
          theme: {
            default: 'vitesse-light',
            dark: 'vitesse-dark',
          },
          langs: [
            'bash',
            'css',
            'diff',
            'html',
            'javascript',
            'js',
            'json',
            'markdown',
            'md',
            'powershell',
            'scss',
            'shell',
            'ts',
            'tsx',
            'typescript',
            'vue',
            'xml',
            'yaml',
            'cs',
          ],
        },
      },
    },
  },
  hub: {
    cache: true,
    database: true,
  },
  compatibilityDate: '2025-01-13'
})
