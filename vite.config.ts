import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
      enabled: true,
      reportsDirectory:'./tests/unit/coverage'
    },
  },
// @ts-expect-error - eslint complains about the type of react not correctly matching the expectation of PluginOptions.
  plugins: [react()],

});
