import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        shell: '#050d1a',
        panel: '#0b1a33',
        ink: '#13284a',
        accent: '#6ec1ff'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.25)'
      }
    }
  },
  plugins: []
};

export default config;
