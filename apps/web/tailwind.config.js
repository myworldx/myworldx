/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],

  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: {
          blur: 'rgb(0,0,0,0.2)',
        },
      },
      backgroundImage: {
        index: 'linear-gradient(45deg, rgba(217,217,217,1) 0%, rgba(233,255,255,1) 100%)',
      },
      keyframes: {
        background: {
          '0%': {
            backgroundSize: '150%',
            transform: 'translateY(50% 0)',
          },
          '50%': {
            backgroundSize: '150%',

            transform: 'translateY(50% 100%)',
          },
          '100%': {
            backgroundSize: '150%',

            transform: 'translateY(50% 0)',
          },
        },
        gif: {
          '0%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-5px)',
          },
          '100%': {
            transform: 'translateY(0px)',
          },
        },
        logo: {
          '0%': {
            border: 'none',
            borderRadius: 0,
          },
          '60%': {
            border: 'none',
            borderRadius: 0,
          },
          '70%': {
            border: 'none',
            borderRadius: 0,
          },
          '80%': {
            border: 'none',
            borderRadius: '9999px',
          },
          '90%': {
            border: '2px #000 solid',
            borderRadius: '9999px',
            'html[data-theme=dark] &': {
              border: '2px #fff solid',
            },
          },
          '95%': {
            border: '2px #fff solid',
            borderRadius: '9999px',
            'html[data-theme=dark] &': {
              border: '2px #000 solid',
            },
          },
          '100%': {
            border: '2px #000 solid',
            borderRadius: '9999px',
            'html[data-theme=dark] &': {
              border: '2px #fff solid',
            },
          },
        },
      },
      animation: {
        'logo-wrapper': 'logo 2s ease-out',
        'logo-gif': 'gif 4s ease 1',
        'text-bg': 'background 5s ease',
      },
    },
  },
  plugins: [],
}
