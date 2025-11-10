import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup',
    reporters: ['default','json'],
    outputFile: './test/test-output.json'
  },
})