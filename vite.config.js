import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [RubyPlugin(), react()],
  server: {
    host: '0.0.0.0',
    port: 3036,
    strictPort: true,
    allowedHosts: ['localhost', 'vite'],
    hmr: {
      host: 'localhost',
      port: 3036,
      clientPort: 3036
    },
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: ['**/node_modules/**', '**/.git/**']
    },
    cors: true
  },
  define: {
    __VITE_HMR_PORT__: 3036
  }
})
