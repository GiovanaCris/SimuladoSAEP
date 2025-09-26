import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  //Passando os valores de teste
  test:{
    globals:true,
    environment:'jsdom'
  }
})
