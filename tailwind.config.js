// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Add other paths if necessary
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        foreground: '#1A202C',
        card: '#FAFAFA',
        'card-foreground': '#4A5568',
        border: '#D1D5DB',
        primary: '#4CAF50',
        accent: '#F0F4F8',
        'muted-foreground': '#4A5568',
        'button-background': '#F0F4F8',
        'button-text': '#1B5E20',
        hover: '#E8F5E9',
      },
      fontFamily: {
        sans: ['Geist Sans', 'Arial', 'sans-serif'],
        mono: ['Geist Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        base: ['16px', '24px'], // Adjust base text size and line height
        lg: ['18px', '28px'],
        xl: ['20px', '30px'],
        '2xl': ['24px', '36px'],
        '3xl': ['30px', '40px'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        36: '9rem',
      },
    },
  },
  plugins: [],
};