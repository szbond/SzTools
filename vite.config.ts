import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve:{
    alias:{'@assets':'./src/assets'}
  },
  build:{
    assetsDir:'static',
    rollupOptions:{
      output:{
        entryFileNames:'static/js/[name].js',
        chunkFileNames:'static/js/[name].js',
        assetFileNames:({name})=>{
          if(/\.(css|less|sass|scss)$/.test(name??'')){
            return 'static/css/[name][extname]'}
          return 'static/asset/[name][extname]'

        }
      }
    }
  }
})
// export default defineConfig(({mode})=>({
//   plugins: [react()],
// }))