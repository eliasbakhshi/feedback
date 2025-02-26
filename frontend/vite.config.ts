import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { config } from 'dotenv';
config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
<<<<<<< HEAD
        target: 'http://localhost:5172',
=======
        target: 'https://jsonplaceholder.typicode.com',
>>>>>>> origin/loginpageDesign
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
})
