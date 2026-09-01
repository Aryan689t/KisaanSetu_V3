/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          green: {
            DEFAULT: '#245C3A',
            dark: '#17432A',
            light: '#3F7D4A',
            soft: '#E8F2EC',
            border: '#D0E3D6'
          },
          gold: {
            DEFAULT: '#D89B32',
            light: '#F8E9C9',
            dark: '#B07B20'
          },
          ivory: {
            DEFAULT: '#F6F2E8',
            surface: '#FFFDF7',
            muted: '#EFEAE0'
          },
          text: {
            DEFAULT: '#243126',
            muted: '#718074',
            light: '#A0ACA3'
          },
          status: {
            success: '#3F7D4A',
            warning: '#C88728',
            danger: '#B94A3A'
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'agri-sm': '0 1px 3px rgba(36, 49, 38, 0.05)',
        'agri-md': '0 4px 12px rgba(36, 49, 38, 0.06), 0 1px 3px rgba(36, 49, 38, 0.04)',
        'agri-lg': '0 12px 24px -4px rgba(36, 49, 38, 0.08), 0 4px 8px -2px rgba(36, 49, 38, 0.04)',
        'agri-inner': 'inset 0 2px 4px 0 rgba(36, 49, 38, 0.04)'
      }
    },
  },
  plugins: [],
}
