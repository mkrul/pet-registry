/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './app/helpers/**/*.rb',
    './app/assets/stylesheets/*.css',
    './app/javascript/entrypoints/*.{css,js}',
    './app/javascript/controllers/*.{css,js}',
    './app/views/**/*.{html,html.erb,erb}',
    './app/src/**/*.{js,jsx,ts,tsx}',
    './app/javascript/components/**/*.{js,jsx,ts,tsx}',
    './app/javascript/pages/**/*.{js,jsx,ts,tsx}',
    './app/assets/stylesheets/**/*.css',
    './app/src/stylesheets/**/*.css',
    './app/src/stylesheets/*.css',
  ],
  daisyui: {
    themes: ["nord"],
  },
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.neutral,
      red: colors.red,
      yellow: colors.amber,
      green: colors.green,
      blue: colors.blue,
      indigo: colors.indigo,
      purple: colors.purple,
      pink: colors.pink,
    },
    screens: {
      'sm': '600px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1720px'
    },
    fontFamily: {
      'sans': ["BlinkMacSystemFont", "Avenir Next", "Avenir",
        "Nimbus Sans L", "Roboto", "Noto Sans", "Segoe UI", "Arial", "Helvetica",
        "Helvetica Neue", "sans-serif"],
      'mono': ["Consolas", "Menlo", "Monaco", "Andale Mono", "Ubuntu Mono", "monospace"]
    },
    extend: {
      margin: {
        '0.5rem': '0.5rem',
        '1rem': '1rem',
        '1.5rem': '1.5rem',
        '2rem': '2rem',
        '2.5rem': '2.5rem',
        '3rem': '3rem',
        '3.5rem': '3.5rem',
        '4rem': '4rem',
        '4.5rem': '4.5rem',
        '5rem': '5rem',
      },
      marginTop: {
        '6rem': '6rem',
      },
      maxWidth: {
        'fit-content': 'fit-content',
        '20rem': '20rem',
        '22rem': '22rem',
        '33rem': '33rem',
        '65%': '65%',
      },
      width: {
        '300px': '300px',
        '85%': '85%',
        '95%': '95%',
        '5rem': '5rem',
        '9rem': '9rem',
        '10rem': '10rem',
        '22rem': '22rem',
        '30rem': '35rem',
        '40rem': '40rem',
        '50rem': '50rem',
      },
      height: {
        '20px': '20px',
        '150px': '150px',
        '8rem': '8rem',
      },
      minHeight: {
        '60rem': '60rem',
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('daisyui'),
  ],
}