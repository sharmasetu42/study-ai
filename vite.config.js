import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration - tells Vite to use the React plugin
export default defineConfig({
  plugins: [react()],
})
