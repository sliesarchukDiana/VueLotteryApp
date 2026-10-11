import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import {fileURLToPath} from "node:url";

export default defineConfig({
  base: '/VueLotteryApp/',
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function']
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});