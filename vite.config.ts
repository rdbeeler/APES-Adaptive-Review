import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // <-- Must be a slash (/), not a dot (.)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/APES-Adaptive-Review/',
})
