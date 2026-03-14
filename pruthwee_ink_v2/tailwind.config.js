/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink:      '#0C0C0C',
        surface:  '#141414',
        raised:   '#1A1A1A',
        lime:     '#CCFF00',
        'cat-env':      '#4ADE80',
        'cat-edu':      '#38BDF8',
        'cat-health':   '#FB7185',
        'cat-sports':   '#FACC15',
        'cat-cultural': '#C4B5FD',
        // legacy aliases
        sky:      '#CCFF00',
        teal:     '#CCFF00',
        ocean:    '#999900',
        deep:     '#1A1A1A',
        midnight: '#0C0C0C',
        light:    '#F2F2F2',
        muted:    '#888888',
      },
      fontFamily: {
        // Barlow Condensed — ALL page headings, stats, nav, buttons (original style)
        display: ["'Barlow Condensed'", "'Arial Narrow'", 'sans-serif'],
        // Syne — landing page hero ONLY (use font-hero class)
        hero:    ["'Syne'", "'Arial Black'", 'sans-serif'],
        // Barlow — body copy
        sans:    ["'Barlow'", 'system-ui', 'sans-serif'],
        // DM Mono — badges, labels
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
        pulseGlow:    { '0%,100%': { boxShadow:'0 0 0 0 rgba(204,255,0,0)' }, '50%': { boxShadow:'0 0 20px 4px rgba(204,255,0,0.2)' } },
        marquee:      { '0%': { transform:'translateX(0)' }, '100%': { transform:'translateX(-50%)' } },
        shimmer:      { '0%': { backgroundPosition:'-200% 0' }, '100%': { backgroundPosition:'200% 0' } },
      },
      boxShadow: {
        'glow':    '0 0 24px rgba(204,255,0,0.2)',
        'glow-lg': '0 0 40px rgba(204,255,0,0.3)',
        'card':    '0 4px 24px rgba(0,0,0,0.6)',
        'deep':    '0 8px 32px rgba(0,0,0,0.8)',
      },
      backgroundImage: {
        'gradient-ink':  'linear-gradient(135deg, #0C0C0C, #141414)',
        'gradient-lime': 'linear-gradient(90deg, #999900, #CCFF00)',
        'grid-pattern':  'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      },
      backgroundSize: { 'grid': '60px 60px' },
      borderRadius:   { 'xl2': '14px' },
      transitionTimingFunction: { 'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    },
  },
  plugins: [],
};
