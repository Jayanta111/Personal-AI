import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), // Add react plugin
    tailwindcss(),
    
  ],
  base: 'https://jayanta111.github.io/Personal-AI/', // Replace with your repository name

});