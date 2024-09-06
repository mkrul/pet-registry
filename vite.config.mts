import { defineConfig } from "vite";
import * as path from "path";
import FullReload from "vite-plugin-full-reload";
import RubyPlugin from "vite-plugin-ruby";
import tailwindcss from "tailwindcss";

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  plugins: [
    RubyPlugin(),
    FullReload(["config/routes.rb", "app/views/**/*"], { delay: 250 })
  ],
  resolve: {
    alias: [
      {
        find: "@/components",
        replacement: path.resolve(__dirname, "./app/frontend/components")
      },
      {
        find: "@/stylesheets",
        replacement: path.resolve(__dirname, "./app/frontend/stylesheets")
      },
      {
        find: "@/entrypoints",
        replacement: path.resolve(__dirname, "./app/javascript/entrypoints")
      }
    ]
  },
})
