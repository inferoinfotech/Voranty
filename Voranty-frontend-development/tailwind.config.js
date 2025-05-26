/** @type {import('tailwindcss').Config} */
export default  {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'dash-reverse': 'dash 2s ease-in-out infinite reverse',
      },
      keyframes: {
        dash: {
          '0%': { strokeDashoffset: '314' },
          '50%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '-314' },
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
