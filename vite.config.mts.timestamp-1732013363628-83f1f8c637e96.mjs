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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL21pc2hha3J1bC9EZXNrdG9wL3Byb2plY3RzL3BldC1yZWdpc3RyeVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21pc2hha3J1bC9EZXNrdG9wL3Byb2plY3RzL3BldC1yZWdpc3RyeS92aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL21pc2hha3J1bC9EZXNrdG9wL3Byb2plY3RzL3BldC1yZWdpc3RyeS92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IEZ1bGxSZWxvYWQgZnJvbSBcInZpdGUtcGx1Z2luLWZ1bGwtcmVsb2FkXCI7XG5pbXBvcnQgUnVieVBsdWdpbiBmcm9tIFwidml0ZS1wbHVnaW4tcnVieVwiO1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJ0YWlsd2luZGNzc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBjc3M6IHtcbiAgICBwb3N0Y3NzOiB7XG4gICAgICBwbHVnaW5zOiBbdGFpbHdpbmRjc3NdLFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICBSdWJ5UGx1Z2luKCksXG4gICAgRnVsbFJlbG9hZChbXCJjb25maWcvcm91dGVzLnJiXCIsIFwiYXBwL3ZpZXdzLyoqLypcIl0sIHsgZGVsYXk6IDI1MCB9KVxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFtcbiAgICAgIHtcbiAgICAgICAgZmluZDogXCJAL2NvbXBvbmVudHNcIixcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9hcHAvZnJvbnRlbmQvY29tcG9uZW50c1wiKVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmluZDogXCJAL3N0eWxlc2hlZXRzXCIsXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vYXBwL2Zyb250ZW5kL3N0eWxlc2hlZXRzXCIpXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaW5kOiBcIkAvZW50cnlwb2ludHNcIixcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9hcHAvamF2YXNjcmlwdC9lbnRyeXBvaW50c1wiKVxuICAgICAgfVxuICAgIF1cbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThULFNBQVMsb0JBQW9CO0FBQzNWLFlBQVksVUFBVTtBQUN0QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGlCQUFpQjtBQUp4QixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixLQUFLO0FBQUEsSUFDSCxTQUFTO0FBQUEsTUFDUCxTQUFTLENBQUMsV0FBVztBQUFBLElBQ3ZCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsV0FBVztBQUFBLElBQ1gsV0FBVyxDQUFDLG9CQUFvQixnQkFBZ0IsR0FBRyxFQUFFLE9BQU8sSUFBSSxDQUFDO0FBQUEsRUFDbkU7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFrQixhQUFRLGtDQUFXLDJCQUEyQjtBQUFBLE1BQ2xFO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBa0IsYUFBUSxrQ0FBVyw0QkFBNEI7QUFBQSxNQUNuRTtBQUFBLE1BQ0E7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWtCLGFBQVEsa0NBQVcsOEJBQThCO0FBQUEsTUFDckU7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
