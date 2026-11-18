const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Plus Jakarta Sans, loaded in src/app/_layout.tsx. On native every weight is a separate
      // font file, so each weight gets its own class. Use these instead of `font-bold` etc.:
      // a fontWeight on top of a custom font can make Android fake the weight. Only the first
      // entry is used on native; the rest are web fallbacks.
      fontFamily: {
        sans: ['PlusJakartaSans_400Regular', 'system-ui', 'sans-serif'],
        'sans-semibold': ['PlusJakartaSans_600SemiBold', 'system-ui', 'sans-serif'],
        'sans-bold': ['PlusJakartaSans_700Bold', 'system-ui', 'sans-serif'],
        'sans-extrabold': ['PlusJakartaSans_800ExtraBold', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand accent (terracotta), defined per theme in global.css
        brand: {
          DEFAULT: 'hsl(var(--brand))',
          foreground: 'hsl(var(--brand-foreground))',
        },
        // Fabric colors of the clothing rail illustration; the same in light and dark mode
        swatch: {
          camel: '#C9A27E',
          ecru: '#E7DCC9',
          olive: '#6E7250',
          navy: '#2F3B52',
          rust: '#B4572F',
          blush: '#E7C2B2',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('tailwindcss-animate')],
};
