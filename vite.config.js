import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glob from 'glob'

export default defineConfig({
    plugins: [react(
        {
            include: '**/*.tsx',
            jsxRuntime: 'classic'
        }
    )],
    build: {
        sourcemap: true,
        minify: "esbuild",
        formats: ['es', 'cjs'],
        outDir: 'asset',
        lib: {
            // Could also be a dictionary or array of multiple entry points
            // get an array of multiple entry points
            entry: [
                ...glob.sync('build/*.tsx'),
                resolve(__dirname, 'build/index.ts'),
                 resolve(__dirname, 'index.html'),
            ],
            // entry: resolve(__dirname, 'build/index.ts'),
            name: "@washingtonpost/wpds-assets"
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['react'],
        }
    }
});
