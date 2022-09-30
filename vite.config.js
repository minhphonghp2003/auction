import { fileURLToPath, URL } from 'node:url'
import inject from '@rollup/plugin-inject'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      './runtimeConfig': './runtimeConfig.browser',
    }
  },
  build: {
		rollupOptions: {
			external: [inject({ Buffer: ['Buffer', 'Buffer'] })],
      
		},
	}, 
   css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/_shared.scss";`
      }
    }
  }
})
