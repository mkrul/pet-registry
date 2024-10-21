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
    './app/frontend/**/*.{js,jsx,ts,tsx}',
    './app/javascript/components/**/*.{js,jsx,ts,tsx}',
    './app/javascript/pages/**/*.{js,jsx,ts,tsx}',
    './app/assets/stylesheets/**/*.css',
    './app/frontend/stylesheets/**/*.css',
    './app/frontend/stylesheets/*.css',
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
      gray: colors.trueGray,
      red: colors.red,
      yellow: colors.amber,
      green: colors.green,
      blue: colors.blue,
      indigo: colors.indigo,
      purple: colors.purple,
      pink: colors.pink,
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',

      // ---------------------- //
      // ------ REPORTS: ------ //
      // ---------------------- //

      'xs-report': '768px',
      'sm-report': '896px',
      'md-report': '1024px',
      'lg-report': '1280px',
      'xl-report': '1536px',
      '2xl-report': '1920px',
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
      maxWidth: {
        '22rem': '22rem',
        '65%': '65%',
      },
      width: {
        '95%': '95%',
        '22rem': '22rem',
        '30rem': '35rem',
        '40rem': '40rem',
        '50rem': '50rem',
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