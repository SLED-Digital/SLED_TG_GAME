import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Директория для собранных файлов
  },
  server: {
    port: 8080, // Порт для разработки
  },
});
