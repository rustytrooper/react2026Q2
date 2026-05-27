import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // server: {
  //   host: '0.0.0.0', // <-- ЭТО САМОЕ ГЛАВНОЕ! Говорит Vite слушать все адреса
  //   port: 5173,       // Порт, на котором будет работать сервер
  //   allowedHosts: "97900344-9f6e-4ad9-8a5c-97ef98b325c9-00-3en6odirql6oo.riker.replit.dev"
  // }
});
