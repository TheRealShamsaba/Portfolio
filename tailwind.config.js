export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    fontFamily: {
      poppins: [
        'Poppins',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial'
      ]
    },
    colors: {
      white: '#FFFFFF',
      black: '#000000',
      transparent: 'transparent',
      current: 'currentColor',
      gray: {
        50: '#F9F9F9',
        100: '#F3F3F3',
        200: '#E8E8E8',
        300: '#D1D1D1',
        400: '#B0B0B0',
        500: '#808080',
        600: '#595959',
        700: '#404040',
        800: '#292929',
        900: '#121212'
      },
      blue: {
        500: '#0066CC',
        600: '#0052A3'
      }
    },
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.6s ease-in-out forwards'
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        }
      }
    }
  },
  plugins: []
}
