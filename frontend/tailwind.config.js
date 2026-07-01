/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#032085',
        'primary-light': '#0a2da3',
        'primary-dark': '#02124d',
        accent: '#dc2b2e',
        'accent-hover': '#b51f22',
        secondary: '#b9d9eb',
        text: '#333333',
        'text-light': '#777777',
        'bg-light': '#F2F4F7',
        border: '#e5e5e5',
      },
      fontFamily: {
        sans: ['Roboto', 'Inter', 'sans-serif'],
        display: ['"Gotham Narrow Bold"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
      },
    },
  },
  plugins: [],
}
