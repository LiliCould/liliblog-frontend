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
            primary: '#E8613C',
            'primary-hover': '#D4502D',
            'primary-light': '#FFF1ED',
            title: '#2D2D2D',
            body: '#4A4A4A',
            muted: '#999999',
            bg: '#FAFAF8',
            card: '#FFFFFF',
            border: '#EEEEE8',
            accent: '#F0A04B',
            success: '#67C23A',
            danger: '#E8613C',
        },
    },
    shortcuts: {
        'btn-primary': 'bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors cursor-pointer border-none text-sm font-medium',
        'btn-outline': 'border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary-light transition-colors cursor-pointer bg-transparent text-sm font-medium',
        'card-base': 'bg-card rounded-xl shadow-sm border border-border p-4',
        'text-title': 'text-title font-semibold',
        'text-body': 'text-body text-sm leading-relaxed',
        'text-muted': 'text-muted text-xs',
        'page-container': 'max-w-1200px mx-auto px-4',
    },
})
