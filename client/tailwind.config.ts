import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    { pattern: /grid-cols-18/ },
    { pattern: /grid-cols-15/ },
    // Add any other specific grid column counts you anticipate needing
  ],
  theme: {
    extend: {
      fontFamily: {
        vg5000: ['VG5000', 'sans-serif']
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        neonGreen: '#39ff14',
        neonPink: '#ff007f',
        neonCyan: '#00ffff',
        darkBlack: '#000000',
        darkerBlack: '#111111',
        brightBlue: '#00c0ff',
        brightGreen: '#00ff00',
        neonYellow: '#ffea00',
        brightRed: '#ff0033',
      },
      boxShadow: {
        glow: '0 0 12px rgba(255, 16, 240, 0.5)', // Example glow color: neon green
      },
      keyframes: {
        slideInFromTop: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOutToTop: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-100%)', opacity: '0' },
        },
      },
      animation: {
        slideIn: 'slideInFromTop 0.5s ease-out forwards',
        slideOut: 'slideOutToTop 0.5s ease-out forwards',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        neonDark: {
          "primary": "#39ff14",    // Neon green
          "secondary": "#161617",  // Neon pink
          "accent": "#FF10F0",     // Neon cyan
          "neutral": "#2A292B",    // Black background
          "base-100": "#000000",   // Darker black for base
          "info": "#00c0ff",       // Bright blue
          "success": "#00ff00",    // Bright green
          "warning": "#ffea00",    // Neon yellow
          "error": "#ff0033",      // Bright red
        },
      },
    ],
    darkTheme: "neonDark",    // Apply custom theme for dark mode
    base: true, // Applies background color and foreground color for root element by default
    styled: true, // Include daisyUI colors and design decisions for all components
    utils: true, // Adds responsive and modifier utility classes
    prefix: "", // Prefix for daisyUI classnames (components, modifiers, and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
};

export default config;
