import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'frontend', 
  build: {
    outDir: path.resolve(__dirname, 'static/dist'),
    emptyOutDir: true,
  },
});