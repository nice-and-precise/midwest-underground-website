/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./dashboard/**/*.html",
    "./src/**/*.{html,js}",
    "./js/**/*.js"
  ],
  darkMode: ['class', '.theme-dark'], // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // New Brand Colors
        brand: {
          'slate-dark': '#343D46',
          'slate': '#4F5B66',
          'slate-light': '#65737E',
          'gray': '#C0C5CE',
          'accent': '#FF8800',
          'accent-hover': '#E67900',
          'white': '#FFFFFF',
          'black': '#000000',
        },
        // Semantic aliases for easier use
        ink: {
          DEFAULT: '#343D46',
          secondary: '#4F5B66',
          subtle: '#65737E',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#C0C5CE',
          dark: '#343D46',
          'dark-muted': '#4F5B66',
        },
        accent: {
          DEFAULT: '#FF8800',
          hover: '#E67900',
          light: '#FFA033',
        },
      },
      fontFamily: {
        heading: ['Oswald', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.25rem',
        'xl': '1.563rem',
        '2xl': '1.953rem',
        '3xl': '2.441rem',
        '4xl': '3.052rem',
      },
      spacing: {
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
        '2xl': '4rem',
        '3xl': '6rem',
      },
      borderRadius: {
        'sm': '0.25rem',
        'base': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(52, 61, 70, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(52, 61, 70, 0.1), 0 1px 2px 0 rgba(52, 61, 70, 0.06)',
        'md': '0 4px 6px -1px rgba(52, 61, 70, 0.1), 0 2px 4px -1px rgba(52, 61, 70, 0.06)',
        'lg': '0 10px 15px -3px rgba(52, 61, 70, 0.1), 0 4px 6px -2px rgba(52, 61, 70, 0.05)',
        'xl': '0 20px 25px -5px rgba(52, 61, 70, 0.1), 0 10px 10px -5px rgba(52, 61, 70, 0.04)',
        // Dark mode shadows
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'dark': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '300ms',
        'slow': '500ms',
      },
    },
  },
  plugins: [],
}
