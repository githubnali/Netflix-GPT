import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react-router-dom') || id.includes('/react/') || id.includes('/react-dom/')) return 'vendor-react';
          if (id.includes('react-redux') || id.includes('@reduxjs')) return 'vendor-redux';
          if (id.includes('firebase')) return 'vendor-firebase';
        },
      },
    },
  }
})
