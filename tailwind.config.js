/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sky:      '#A7EBF2',
        teal:     '#54ACBF',
        ocean:    '#26658C',
        deep:     '#023859',
        midnight: '#011C40',
        light:    '#EAF7F9',
        muted:    '#8BBFCC',
      },
      fontFamily: {
        // Barlow Condensed — headings, stats, nav, buttons, labels
        display: ["'Barlow Condensed'", "'Arial Narrow'", 'sans-serif'],
        // Barlow — body copy, paragraphs, descriptions
        sans:    ["'Barlow'", 'system-ui', 'sans-serif'],
        // DM Mono — badges, codes, tags, overlines
        mono:    ["'DM Mono'", "'Courier New'", 'monospace'],
      },
      animation: {
        'fadeUp':       'fadeUp 0.6s ease forwards',
        'fadeIn':       'fadeIn 0.5s ease forwards',
        'scaleIn':      'scaleIn 0.4s ease forwards',
        'slideInLeft':  'slideInLeft 0.6s ease forwards',
        'slideInRight': 'slideInRight 0.6s ease forwards',
        'bounceY':      'bounceY 1.5s ease-in-out infinite',
        'pulseGlow':    'pulseGlow 2s ease-in-out infinite',
        'marquee':      'marquee 35s linear infinite',
        'shimmer':      'shimmer 1.5s ease-in-out infinite',
        'spin-slow':    'spin 3s linear infinite',
      },
      keyframes: {
        fadeUp:       { '0%': { opacity:'0', transform:'translateY(24px)' }, '100%': { opacity:'1', transform:'translateY(0)' } },
        fadeIn:       { '0%': { opacity:'0' }, '100%': { opacity:'1' } },
        scaleIn:      { '0%': { opacity:'0', transform:'scale(0.92)' }, '100%': { opacity:'1', transform:'scale(1)' } },
        slideInLeft:  { '0%': { opacity:'0', transform:'translateX(-40px)' }, '100%': { opacity:'1', transform:'translateX(0)' } },
        slideInRight: { '0%': { opacity:'0', transform:'translateX(40px)'  }, '100%': { opacity:'1', transform:'translateX(0)' } },
        bounceY:      { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(8px)' } },
        pulseGlow:    { '0%,100%': { boxShadow:'0 0 0 0 rgba(84,172,191,0)' }, '50%': { boxShadow:'0 0 20px 4px rgba(84,172,191,0.25)' } },
        marquee:      { '0%': { transform:'translateX(0)' }, '100%': { transform:'translateX(-50%)' } },
        shimmer:      { '0%': { backgroundPosition:'-200% 0' }, '100%': { backgroundPosition:'200% 0' } },
      },
      boxShadow: {
        'glow':    '0 0 24px rgba(84,172,191,0.3)',
        'glow-lg': '0 0 40px rgba(84,172,191,0.4)',
        'card':    '0 4px 24px rgba(1,28,64,0.6)',
        'deep':    '0 8px 32px rgba(1,28,64,0.8)',
      },
      backgroundImage: {
        'gradient-luna': 'linear-gradient(135deg, #011C40 0%, #023859 50%, #26658C 100%)',
        'gradient-teal': 'linear-gradient(90deg, #26658C, #54ACBF, #A7EBF2)',
        'grid-pattern':  'linear-gradient(rgba(84,172,191,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(84,172,191,0.05) 1px, transparent 1px)',
      },
      backgroundSize: { 'grid': '60px 60px' },
      borderRadius:   { 'xl2': '20px' },
      transitionTimingFunction: { 'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },
  },
  plugins: [],
};