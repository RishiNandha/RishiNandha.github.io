import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [react(), 
      process.env.NODE_ENV !== "development" && nodePolyfills(),
    ].filter(Boolean),
  base: '/',
  ssr: {
    external: ['react', 'react-dom'],
  },
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
  },
})

