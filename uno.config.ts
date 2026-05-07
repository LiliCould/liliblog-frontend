import { defineConfig, presetUno, presetAttributify, transformerDirectives } from 'unocss'

export default defineConfig({
    presets: [
        presetUno(),
        presetAttributify(),
    ],
    transformers: [
        transformerDirectives(),
    ],
    theme: {
        colors: {
            primary: '#00f0ff',
            'primary-hover': '#00c8d4',
            'primary-light': 'rgba(0,240,255,0.1)',
            title: '#e0e0e8',
            body: '#b0b0c0',
            muted: '#6a6a80',
            bg: '#0a0a0f',
            card: '#12121a',
            border: 'rgba(0,240,255,0.15)',
            accent: '#ff2d78',
            success: '#00ff88',
            danger: '#ff2d78',
        },
    },
    shortcuts: {
        'btn-primary': 'bg-primary text-#0a0a0f px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors cursor-pointer border-none text-sm font-medium',
        'btn-outline': 'border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary-light transition-colors cursor-pointer bg-transparent text-sm font-medium',
        'card-base': 'bg-card rounded-xl shadow-sm border border-border p-4',
        'text-title': 'text-title font-semibold',
        'text-body': 'text-body text-sm leading-relaxed',
        'text-muted': 'text-muted text-xs',
        'page-container': 'max-w-1200px mx-auto px-4',
    },
})
