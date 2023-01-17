// vite.config.ts
import { defineConfig } from "file:///home/nils/projects/handlebars-ng/node_modules/vite/dist/node/index.js";
import dts from "file:///home/nils/projects/handlebars-ng/node_modules/vite-plugin-dts/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [dts({ include: "src" })],
  build: {
    outDir: "dist",
    lib: {
      entry: {
        index: "src/index.ts"
      },
      formats: ["es", "cjs"],
      name: "handlebars-parser"
    },
    sourcemap: true,
    minify: false,
    target: "esnext"
  },
  test: {
    globals: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9uaWxzL3Byb2plY3RzL2hhbmRsZWJhcnMtbmcvcGFja2FnZXMvQGhhbmRsZWJhcnMtbmcvcnVubmVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9uaWxzL3Byb2plY3RzL2hhbmRsZWJhcnMtbmcvcGFja2FnZXMvQGhhbmRsZWJhcnMtbmcvcnVubmVyL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL25pbHMvcHJvamVjdHMvaGFuZGxlYmFycy1uZy9wYWNrYWdlcy9AaGFuZGxlYmFycy1uZy9ydW5uZXIvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgZHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW2R0cyh7IGluY2x1ZGU6IFwic3JjXCIgfSldLFxuICBidWlsZDoge1xuICAgIG91dERpcjogXCJkaXN0XCIsXG4gICAgbGliOiB7XG4gICAgICBlbnRyeToge1xuICAgICAgICBpbmRleDogXCJzcmMvaW5kZXgudHNcIixcbiAgICAgIH0sXG4gICAgICBmb3JtYXRzOiBbXCJlc1wiLCBcImNqc1wiXSxcbiAgICAgIG5hbWU6IFwiaGFuZGxlYmFycy1wYXJzZXJcIixcbiAgICB9LFxuXG4gICAgc291cmNlbWFwOiB0cnVlLFxuICAgIG1pbmlmeTogZmFsc2UsXG4gICAgdGFyZ2V0OiBcImVzbmV4dFwiLFxuICB9LFxuICB0ZXN0OiB7XG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUVBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUVoQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsTUFBTSxDQUFDLENBQUM7QUFBQSxFQUNqQyxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixLQUFLO0FBQUEsTUFDSCxPQUFPO0FBQUEsUUFDTCxPQUFPO0FBQUEsTUFDVDtBQUFBLE1BQ0EsU0FBUyxDQUFDLE1BQU0sS0FBSztBQUFBLE1BQ3JCLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFFQSxXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLEVBQ1g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
