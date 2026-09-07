import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { certAssets } from './vite-plugins/cert-assets.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), certAssets()],
  server: {
    port: 5173,
    host: true,
  },
})
