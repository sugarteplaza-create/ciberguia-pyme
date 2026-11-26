import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_BASE permite publicar en GitHub Pages (ej: /ciberguia-pyme/)
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: { port: 5173 },
  test: { environment: 'node', include: ['tests/**/*.test.js'] },
});
