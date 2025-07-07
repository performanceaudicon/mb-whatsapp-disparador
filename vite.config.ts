import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/mb-whatsapp-disparador/',   // ← igual ao nome do repo
  plugins: [react()],
})

// src/config.ts
export const WEBHOOK = 'https://primary-production-7688.up.railway.app/webhook/send-group-messages';
