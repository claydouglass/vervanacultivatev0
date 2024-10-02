// tailwind.config.js
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}', // Adjust paths as needed
      './components/**/*.{js,ts,jsx,tsx}',
      // Add other paths if necessary
    ],
    theme: {
      extend: {
        colors: {
          // Define your custom colors here
          border: '#E5E7EB', // Light gray color
          card: '#FFFFFF', // White color for cards
          'card-foreground': '#1F2937', // Dark gray for text
          background: '#F9FAFB', // Background color
          foreground: '#111827', // Text color
          primary: '#2563EB', // Blue for primary elements
          accent: '#EFF6FF', // Light blue accent
        },
      },
    },
    plugins: [],
  };