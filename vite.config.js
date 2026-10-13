import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Ensure React Router works on Vercel (SPA routing)
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
