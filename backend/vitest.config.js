import path from 'path';
import { defineConfig } from 'tsup';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
