import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
// src/config.ts
export const WEBHOOK = 'https://primary-production-7688.up.railway.app/webhook/mb-send-group-messages';
