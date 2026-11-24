import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // GitHub Pages serves this repo at /portfolio-3d/ (set by the deploy workflow); '/' locally and on Vercel
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  build: {
    // three + rapier are large; they live in lazy-loaded chunks (React.lazy)
    chunkSizeWarningLimit: 2500,
  },
});
