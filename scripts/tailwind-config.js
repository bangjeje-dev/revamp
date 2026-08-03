tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Outfit', 'Inter', 'sans-serif'],
                    },
                    colors: {
                        dark: '#050505',
                        surface: '#0D1117',
                        card: '#111827',
                        accent: '#C3FF00',
                        accentHover: '#D7FF4D',
                        glow: 'rgba(195, 255, 0, 0.35)',
                        textPrimary: '#F8FAFC',
                        textSecondary: '#94A3B8',
                        glass: 'rgba(255, 255, 255, 0.08)'
                    },
                    maxWidth: {
                        '8xl': '1440px',
                    },
                    letterSpacing: {
                        tightest: '-.075em',
                        tighter: '-.04em',
                        tight: '-.02em',
                        normal: '0',
                        wide: '.025em',
                        widest: '.1em',
                        caps: '.2em',
                    },
                    backgroundImage: {
                        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                        'mesh': 'radial-gradient(at 40% 20%, hsla(171, 70%, 20%, 0.4) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189, 70%, 15%, 0.4) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(171, 70%, 15%, 0.4) 0px, transparent 50%)',
                    }
                }
            }
        }