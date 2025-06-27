import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/script.mjs'),
      name: 'main',
      fileName: () => 'script.js',
      formats: ['es']
    }
  },
  resolve: {
    alias: {
      dompurify: resolve(__dirname, 'src/dompurify.mjs')
    }
  }
});
