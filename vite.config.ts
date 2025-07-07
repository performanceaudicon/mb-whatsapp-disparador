import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/mb-whatsapp-disparador/',   // ← igual ao nome do repo
  plugins: [react()],
})
