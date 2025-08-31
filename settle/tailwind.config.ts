import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0f172a", // slate-900
                foreground: "#ffffff",
                primary: {
                    DEFAULT: "#0f172a", // slate-900
                    light: "#1f2937",   // gray-800
                },
                accent: {
                    DEFAULT: "#f59e0b", // amber-500 for better white text contrast
                    light: "#fbbf24",   // amber-400
                },
                secondary: "#3b82f6", // blue-500 (used subtly)
                success: "#2dd4bf",
                warning: "#f59e0b",
                error: "#ef4444",
                card: "#001122",
                border: "#1a2332",
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'slide-up': 'slide-up 0.6s ease-out',
                'slide-in-right': 'slide-in-right 0.6s ease-out',
            },
            backdropBlur: {
                xs: '2px',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'pulse-glow': {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(255, 214, 10, 0.4)',
                    },
                    '50%': {
                        boxShadow: '0 0 30px rgba(255, 214, 10, 0.8)',
                    },
                },
                'slide-up': {
                    from: {
                        opacity: '0',
                        transform: 'translateY(30px)',
                    },
                    to: {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                'slide-in-right': {
                    from: {
                        opacity: '0',
                        transform: 'translateX(30px)',
                    },
                    to: {
                        opacity: '1',
                        transform: 'translateX(0)',
                    },
                },
            },
        },
    },
    plugins: [],
};

export default config;
