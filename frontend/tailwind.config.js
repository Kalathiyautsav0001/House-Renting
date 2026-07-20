/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // include all your React files
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB', // Primary
          green: '#22C55E', // Accent / CTA / Available
        },
        bg: {
          white: '#FFFFFF',
          soft: '#F8FAFC',
        },
        text: {
          dark: '#0F172A',
          muted: '#64748B',
        },
        status: {
          red: '#EF4444',
          yellow: '#F59E0B',
          green: '#22C55E'
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
};
