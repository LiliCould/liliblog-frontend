/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0a0f',
          surface: '#111118',
          elevated: '#1a1a24',
          primary: '#00f0ff',
          pink: '#ff2d78',
          green: '#a3e635',
          body: '#e0e0e8',
          title: '#ffffff',
          muted: '#6b7280',
          border: 'rgba(0, 240, 255, 0.15)',
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
              border: '2px solid #000000',
              padding: '1rem',
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
              border: '2px solid #292524',
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
