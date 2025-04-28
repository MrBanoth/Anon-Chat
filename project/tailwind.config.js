/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAElBMVEUAAAD8/vz08vT09vT8+vzs7uxH16TeAAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAuFJREFUOI0Vk+3NLiEIRG1B8ClAYAsQ2AIEt4D9ePtv5Xp/mZgYJ2fOFJKEfInkVWY2aglmQFkimRTV7MblYyVqD7HXyhKsSuPX12MeDhRHLtGvRG+P+B/S0Vu4OswR9tmvR32CW/Zt2FOj4dD7Pev71Y/1mYXxuNXtPqQX4XeOflxafv0B6UfIGPrVXrPGzB3w/FA7/As/ICXyA+YFEsd+fP4WQjgvIP1g3B85yveBR+4fMb6z9yOZVqYfh4V0/5yqHwqXYhOvLP3I0k/prB+5KHlKP7I1eghWUvVD8K/0k0uXP+sHU/o5kv5b+iXp1+RkpF+T/5J+w+tfGUL5lf6g8j8cVf7V6Y+vz0/0S+f/PvXbpcgfXf72h+1n1d+Ea/qjwDx/RH8k1/nfXOMmvvWjYl/6c/B2/5ZQfhN+5D/ppH/A/rWf3bcg3QFu+qNw+wOQfqKm/5X5/3f6gRsA+32r/sAcf1F6/qF/B+5v9E9BWj+K6Z+B6o8t/fys/1f1L8Dp/sz4qPo3cNW/A5J+s5N+s0v/kKR/yOMf+o+cfqV/ycy/skj/ets/tN7/IXd+6PjH+v7tyn8KP/7LduAH53/Mej/2by/02z/x7Z/8zN+H6Kf/6PzvL/1jM+Qf/6j6x4L8E3/pn/hX/5j1R/8k1/mzPv+Zfw6qf+j0L/1j4/qnvvrHhvXPcO2f4dt/w5n/3Ff93fn/6b/hU//gP+v/n/oX+fU/0n/I0/8IvP1Xn/7d6L/6/b/8KP/tejkZ6J9/5P/2t/5/n//PP/X/s/6V9Z/8/vf/9j80zv/Rff6P4PQ/dv53/p9/6n9o1T+B6p//5v/5P+Q/3Oz/P8v5z/76//n6/9mR/v+Z/2/8/78t/f8v+f/fev7/e/r/f+f//wf//7/q/88o/z8j/f9v9f9/nv//z9Z/QCB/QQjV+w9Q/IYDAAAAAElFTkSuQmCC')",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}