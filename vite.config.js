import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite conexiones externas
    port: 5173, // Cambialo según tu puerto
    allowedHosts: ["6432-201-235-103-19.ngrok-free.app"], // Dominio generado por Ngrok
  },
})
