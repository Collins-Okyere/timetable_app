/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E88E5',   // custom main emerald
          dark: '#1D4ED8',      // tailwind emerald-700
          light: '#BBDEFB',     // light emerald for backgrounds
        },
        accent: {
          DEFAULT: '#F97316',   // orange
          light: '#FEF3C7',     // light orange background
        },
        success: {
          DEFAULT: '#10B981',   // green-500
          dark: '#047857',      // green-700
          light: '#D1FAE5',     // green-100
        },
        warning: {
          DEFAULT: '#F59E0B',   // amber-500
          dark: '#B45309',      // amber-700
          light: '#FEF3C7',     // amber-100
        },
        error: {
          DEFAULT: '#EF4444',   // red-500
          dark: '#B91C1C',      // red-700
          light: '#FEE2E2',     // red-100
        },
        background: '#F9FAFB',  // neutral background
        text: {
          DEFAULT: '#1F2937',   // gray-800 for body text
          light: '#6B7280',     // gray-500 for secondary
          dark: '#111827',      // gray-900 for headings
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: { 
    themes: ["light"],
    darkTheme: "light" 
  }

}


