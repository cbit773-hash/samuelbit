/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#1a1d21',
        foreground: '#f5f6f4',
        brand: '#9fe870',
        'brand-hover': '#8fd85f',
        'brand-ink': '#163300',
        primary: '#9fe870',
        'primary-hover': '#8fd85f',
        'primary-soft': 'rgba(159, 232, 112, 0.12)',
        'accent-lime': '#9fe870',
        surface: '#2a2d30',
        'surface-alt': '#32363a',
        'surface-inset': '#232629',
        'surface-info': 'rgba(159, 232, 112, 0.08)',
        'surface-form': '#ffffff',
        muted: 'rgba(245, 246, 244, 0.65)',
        'muted-tertiary': 'rgba(245, 246, 244, 0.45)',
        border: 'rgba(255, 255, 255, 0.08)',
        canvas: '#1a1d21',
        danger: '#ef4444',
        success: '#9fe870',
        'polar-white': '#ffffff',
        'deep-graphite': 'rgba(245, 246, 244, 0.72)',
        'pale-mist': '#32363a',
        'ash-stone': '#232629',
        'skybound-blue': '#9fe870',
        'midnight-ink': '#0e0f0c',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        input: '10px',
        pill: '9999px',
        tab: '30px',
        'card-lg': '28px',
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
};
