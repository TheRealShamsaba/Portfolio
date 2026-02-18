import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Prefer typed source files when both .tsx and .jsx variants exist.
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.mts', '.json']
  }
})
