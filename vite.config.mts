import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'

export default defineConfig({
  plugins: [RubyPlugin()],
  server: {
    host: true,          // 0.0.0.0
    port: 3036,
    strictPort: true,
    hmr: { host: 'localhost', port: 3036 },
    watch: { usePolling: true }
  }
})