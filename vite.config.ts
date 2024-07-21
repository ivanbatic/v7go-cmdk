import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const apiKey = loadEnv(mode, process.cwd(), 'V7_').V7_API_KEY
  if (!apiKey) {
    throw new Error('V7_API_KEY is required in .env')
  }

  return {
    plugins: [
      vue()
      // vueDevTools()
    ],
    server: {
      proxy: {
        '/api': {
          target: 'https://go.v7labs.com',
          changeOrigin: true,
          headers: {
            'X-API-KEY': apiKey,
            accept: 'application/json'
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
