/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        t: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          elevated: 'var(--color-elevated)',
          card: 'var(--color-card)',
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          secondary: 'var(--color-secondary)',
          tertiary: 'var(--color-tertiary)',
          title: 'var(--color-title)',
          'title-secondary': 'var(--color-title-secondary)',
          body: 'var(--color-body)',
          'body-secondary': 'var(--color-body-secondary)',
          muted: 'var(--color-muted)',
          'muted-light': 'var(--color-muted-light)',
          border: 'var(--color-border)',
          'border-hover': 'var(--color-border-hover)',
          'border-solid': 'var(--color-border-solid)',
          accent: 'var(--color-accent)',
          success: 'var(--color-success)',
          danger: 'var(--color-danger)',
          warning: 'var(--color-warning)',
          info: 'var(--color-info)',
          'input-bg': 'var(--color-input-bg)',
          'code-bg': 'var(--color-code-bg)',
          'primary-fill': 'var(--color-primary-fill)',
          'on-primary': 'var(--color-on-primary)',
          'on-danger': 'var(--color-on-danger)',
          overlay: 'var(--color-overlay)',
          scrim: 'var(--color-scrim)',
          glass: 'var(--glass-bg)',
          'glass-strong': 'var(--glass-bg-strong)',
          'glass-panel': 'var(--glass-panel-bg)',
          'glass-border': 'var(--glass-border)',
          'success-soft': 'var(--color-success-soft)',
          'danger-soft': 'var(--color-danger-soft)',
          'warning-soft': 'var(--color-warning-soft)',
          'info-soft': 'var(--color-info-soft)',
          'danger-border': 'var(--color-danger-border)',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', '"SF Mono"', '"Cascadia Code"', 'monospace'],
      },
      maxWidth: {
        content: '720px',
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '16px',
        card: 'var(--radius-card)',
        panel: 'var(--radius-panel)',
        control: 'var(--radius-control)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        glass: 'var(--shadow-glass)',
      },
      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
        emphasized: 'var(--ease-emphasized)',
        spring: 'var(--ease-spring)',
      },
      transitionDuration: {
        fast: 'var(--motion-fast)',
        card: 'var(--motion-card)',
        page: 'var(--motion-page)',
        image: 'var(--motion-image)',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'inherit',
            'h1, h2, h3, h4': {
              fontWeight: '800',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
            },
            'h2': {
              borderBottomWidth: '1px',
              paddingBottom: '0.5rem',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            'code': {
              fontFamily: '"JetBrains Mono", monospace',
              padding: '2px 6px',
              borderRadius: '0px',
              fontSize: '0.875em',
            },
            'pre': {
              borderRadius: '0px',
              padding: '0',
            },
            'blockquote': {
              borderLeftWidth: '4px',
              fontStyle: 'normal',
              paddingLeft: '1rem',
            },
            'a': {
              textDecoration: 'none',
              fontWeight: '600',
            },
            'img': {
              borderRadius: '12px',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
          },
        },
        dark: {
          css: {
            'pre': {
              borderRadius: '0px',
              padding: '0',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
