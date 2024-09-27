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
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }

      // ---------------------- //
      // ------ REPORTS: ------ //
      // ---------------------- //

      'sm-report': '640px',
      // => @media (min-width: 640px) { ... }

      'md-report': '768px',
      // => @media (min-width: 768px) { ... }

      'lg-report': '1294px',
      // => @media (min-width: 1024px) { ... }

      'xl-report': '1834px',
      // => @media (min-width: 1280px) { ... }

      '2xl-report': '2434',
      // => @media (min-width: 1536px) { ... }
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
      width: {
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',
        '3/7': '42.8571429%',
        '4/7': '57.1428571%',
        '5/7': '71.4285714%',
        '6/7': '85.7142857%',
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