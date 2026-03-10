import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api/openrouter': {
                target: 'https://openrouter.ai',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api\/openrouter/, '')
            },
            '/api/nvidia': {
                target: 'https://integrate.api.nvidia.com',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api\/nvidia/, '')
            }
        }
    }
})
