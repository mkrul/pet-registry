import { defineConfig } from 'vite';
import RubyPlugin from 'vite-plugin-ruby';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    RubyPlugin(),
  ],
  build: {
    outDir: 'public/vite',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'app/javascript/entrypoints/application.js'),
        app: resolve(__dirname, 'app/src/App.tsx')
      }
    }
  }
});