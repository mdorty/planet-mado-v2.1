import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pm-dark-blue': '#1a1a2e',
        'pm-blue': '#0f3461',
        'pm-navy': '#15203c',
        'pm-red': '#e9445f',
        'pm-cream': '#f9fbc1',
        'pm-white': '#fbfbfb',
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
  darkMode: "class",
  plugins: [],
};
export default config;