// vite.config.mts
import { defineConfig } from "file:///Users/mishakrul/Desktop/projects/pet-registry/node_modules/vite/dist/node/index.js";
import * as path from "path";
import FullReload from "file:///Users/mishakrul/Desktop/projects/pet-registry/node_modules/vite-plugin-full-reload/dist/index.js";
import RubyPlugin from "file:///Users/mishakrul/Desktop/projects/pet-registry/node_modules/vite-plugin-ruby/dist/index.js";
import tailwindcss from "file:///Users/mishakrul/Desktop/projects/pet-registry/node_modules/tailwindcss/lib/index.js";
var __vite_injected_original_dirname = "/Users/mishakrul/Desktop/projects/pet-registry";
var vite_config_default = defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss]
    }
  },
  plugins: [
    RubyPlugin(),
    FullReload(["config/routes.rb", "app/views/**/*"], { delay: 250 })
  ],
  resolve: {
    alias: [
      {
        find: "@/components",
        replacement: path.resolve(__vite_injected_original_dirname, "./app/src/components")
      },
      {
        find: "@/stylesheets",
        replacement: path.resolve(__vite_injected_original_dirname, "./app/src/stylesheets")
      },
      {
        find: "@/entrypoints",
        replacement: path.resolve(__vite_injected_original_dirname, "./app/javascript/entrypoints")
      }
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL21pc2hha3J1bC9EZXNrdG9wL3Byb2plY3RzL3BldC1yZWdpc3RyeVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21pc2hha3J1bC9EZXNrdG9wL3Byb2plY3RzL3BldC1yZWdpc3RyeS92aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL21pc2hha3J1bC9EZXNrdG9wL3Byb2plY3RzL3BldC1yZWdpc3RyeS92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IEZ1bGxSZWxvYWQgZnJvbSBcInZpdGUtcGx1Z2luLWZ1bGwtcmVsb2FkXCI7XG5pbXBvcnQgUnVieVBsdWdpbiBmcm9tIFwidml0ZS1wbHVnaW4tcnVieVwiO1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJ0YWlsd2luZGNzc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBjc3M6IHtcbiAgICBwb3N0Y3NzOiB7XG4gICAgICBwbHVnaW5zOiBbdGFpbHdpbmRjc3NdLFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICBSdWJ5UGx1Z2luKCksXG4gICAgRnVsbFJlbG9hZChbXCJjb25maWcvcm91dGVzLnJiXCIsIFwiYXBwL3ZpZXdzLyoqLypcIl0sIHsgZGVsYXk6IDI1MCB9KVxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFtcbiAgICAgIHtcbiAgICAgICAgZmluZDogXCJAL2NvbXBvbmVudHNcIixcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9hcHAvc3JjL2NvbXBvbmVudHNcIilcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpbmQ6IFwiQC9zdHlsZXNoZWV0c1wiLFxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL2FwcC9zcmMvc3R5bGVzaGVldHNcIilcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpbmQ6IFwiQC9lbnRyeXBvaW50c1wiLFxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL2FwcC9qYXZhc2NyaXB0L2VudHJ5cG9pbnRzXCIpXG4gICAgICB9XG4gICAgXVxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFQsU0FBUyxvQkFBb0I7QUFDM1YsWUFBWSxVQUFVO0FBQ3RCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8saUJBQWlCO0FBSnhCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNQLFNBQVMsQ0FBQyxXQUFXO0FBQUEsSUFDdkI7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxXQUFXO0FBQUEsSUFDWCxXQUFXLENBQUMsb0JBQW9CLGdCQUFnQixHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFBQSxFQUNuRTtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0w7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWtCLGFBQVEsa0NBQVcsc0JBQXNCO0FBQUEsTUFDN0Q7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFrQixhQUFRLGtDQUFXLHVCQUF1QjtBQUFBLE1BQzlEO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBa0IsYUFBUSxrQ0FBVyw4QkFBOEI7QUFBQSxNQUNyRTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
