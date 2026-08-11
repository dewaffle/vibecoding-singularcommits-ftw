import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // In dev, `npm run dev` (Vite, :5173) proxies /api calls to the
      // Express backend (`npm start` in backend/, :3001) so the app can
      // always call relative /api/... paths — same as it will in production
      // once Express serves the built frontend directly.
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
