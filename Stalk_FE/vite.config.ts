import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 3001,
    open: true,
    host: true,
    proxy: {
      '/api': {
        target: 'https://i13e205.p.ssafy.io:8443',
        changeOrigin: true,
        secure: false,
        ws: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('🚀 Proxy Request:', req.method, req.url);
            
            // POST 요청의 body 데이터 로깅
            if (req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', () => {
                console.log('📝 POST Body:', body);
              });
            }
          });
          
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('📥 Proxy Response:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  build: {
    outDir: 'build',
    sourcemap: true
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
}) 