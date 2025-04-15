import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pm-nav-orange': '#CB5C0D',
        'pm-text-dark': '#404040',
        'pm-white': '#ffffff',
        'pm-nav-orange-hover': '#b34f0b',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        anton: ['Anton', 'cursive'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  },
  plugins: [],
};
export default config;