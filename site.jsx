// ─────────────────────────────────────────────────────────────
// Beneplus — Shared site UI (v6)
// Adds: mobile nav, scroll-reveal, responsive grid utilities,
// scroll-aware nav, About page wiring.
// ─────────────────────────────────────────────────────────────

// ─── Global stylesheet (responsive + reveal + a11y) ──────────
(function injectGlobalStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('bp-globals')) return;
  const style = document.createElement('style');
  style.id = 'bp-globals';
  style.textContent = `
    html { scroll-behavior: smooth; }
    *:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 3px; border-radius: 4px; }
    img, svg { max-width: 100%; }

    /* responsive grid utilities */
    .bp-grid { display: grid; gap: 16px; }
    .bp-grid-4 { grid-template-columns: repeat(4, 1fr); }
    .bp-grid-3 { grid-template-columns: repeat(3, 1fr); }
    .bp-grid-2 { grid-template-columns: repeat(2, 1fr); }
    .bp-hero { display: grid; grid-template-columns: 1.5fr 1fr; gap: 56px; align-items: center; }
    .bp-split { display: grid; grid-template-columns: 1.5fr 1fr; gap: 56px; align-items: center; }
    .bp-stack { display: flex; flex-direction: column; gap: 24px; }
    .bp-row { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 24px; }

    /* responsive padding utility */
    .bp-pad { padding: 140px 40px; }
    .bp-pad-sm { padding: 100px 40px; }

    @media (max-width: 1000px) {
      .bp-grid-4 { grid-template-columns: repeat(2, 1fr); }
      .bp-grid-3 { grid-template-columns: 1fr; }
      .bp-grid-2 { grid-template-columns: 1fr; }
      .bp-hero, .bp-split { grid-template-columns: 1fr; gap: 40px; }
      .bp-hero-mark { justify-self: center; }
    }
    @media (max-width: 640px) {
      .bp-grid-4 { grid-template-columns: 1fr; }
      .bp-pad { padding: 80px 22px; }
      .bp-pad-sm { padding: 60px 22px; }
    }

    /* fluid display type — replaces large fixed sizes */
    .bp-h1 { font-size: clamp(40px, 9vw, 96px); line-height: 0.97; letter-spacing: -0.045em; font-weight: 700; margin: 0; }
    .bp-h2 { font-size: clamp(34px, 5.5vw, 64px); line-height: 1.0; letter-spacing: -0.04em; font-weight: 700; margin: 0; }
    .bp-h2-xl { font-size: clamp(40px, 7vw, 80px); line-height: 1.0; letter-spacing: -0.045em; font-weight: 700; margin: 0; }
    .bp-h3 { font-size: clamp(22px, 2.4vw, 28px); line-height: 1.1; letter-spacing: -0.025em; font-weight: 600; margin: 0; }

    /* scroll-reveal */
    @keyframes bp-fade-up {
      from { opacity: 0; transform: translate3d(0, 28px, 0); }
      to   { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    @keyframes bp-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    .bp-reveal { opacity: 0; transform: translate3d(0, 28px, 0); transition: opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1); will-change: transform, opacity; }
    .bp-reveal.is-in { opacity: 1; transform: translate3d(0, 0, 0); }

    /* button base */
    .bp-btn {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 14px 22px; border-radius: 10px;
      font-family: ${DISPLAY}; font-size: 15px; font-weight: 600;
      text-decoration: none; cursor: pointer; border: none;
      transition: transform 200ms ease, box-shadow 200ms ease, background 200ms ease;
    }
    .bp-btn:hover { transform: translateY(-2px); }

    /* mobile nav */
    .bp-nav-links { display: flex; align-items: center; gap: 32px; }
    .bp-nav-burger { display: none; background: none; border: none; cursor: pointer; padding: 8px; }
    @media (max-width: 880px) {
      .bp-nav-links { display: none; }
      .bp-nav-burger { display: inline-flex; }
      .bp-nav-links.is-open {
        display: flex; flex-direction: column;
        position: fixed; left: 0; right: 0; top: 64px;
        padding: 24px; gap: 18px;
        align-items: stretch; z-index: 99;
        backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
        animation: bp-fade-in 220ms ease;
      }
      .bp-nav-links.is-open > a { padding: 14px 18px; border-radius: 10px; font-size: 17px !important; }
    }

    /* animated marquee row */
    @keyframes bp-marquee {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .bp-marquee { display: flex; gap: 56px; animation: bp-marquee 40s linear infinite; width: max-content; }

    /* tappable hit area on mobile */
    @media (max-width: 640px) {
      .bp-tap { min-height: 44px; }
    }

    /* reduce motion respect — disable scroll-reveal + transitions, keep brand keyframes */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { transition-duration: 0.01ms !important; }
      .bp-reveal { opacity: 1; transform: none; transition: none; }
      .bp-marquee { animation: none; }
    }
  `;
  document.head.appendChild(style);
})();

// ─── Hooks ──────────────────────────────────────────────────
function useMediaQuery(query) {
  const [matches, setMatches] = React.useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );
  React.useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    m.addEventListener ? m.addEventListener('change', onChange) : m.addListener(onChange);
    return () => m.removeEventListener ? m.removeEventListener('change', onChange) : m.removeListener(onChange);
  }, [query]);
  return matches;
}

function useReveal(opts = {}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      if (el) el.classList.add('is-in');
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.classList.add('is-in');
          io.unobserve(el);
        }
      });
    }, { threshold: opts.threshold ?? 0.12, rootMargin: opts.rootMargin ?? '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

// Reveal wrapper — preserves layout, just adds the class.
function Reveal({ children, delay = 0, as: Tag = 'div', style, className = '', ...rest }) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`bp-reveal ${className}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined, ...(style || {}) }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

// ─── Nav ─────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'services',   label: 'Services',   href: 'services.html' },
  { id: 'industries', label: 'Industries', href: 'industries.html' },
  { id: 'portfolio',  label: 'Portfolio',  href: 'portfolio.html' },
  { id: 'about',      label: 'About',      href: 'about.html' },
  { id: 'contact',    label: 'Contact',    href: 'contact.html' },
];

function Nav({ active = '', variant = 'dark' }) {
  const dark = variant === 'dark';
  const scrolled = useScrolled(8);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const surface = dark
    ? (scrolled ? 'rgba(10, 14, 24, 0.88)' : 'rgba(10, 14, 24, 0.6)')
    : (scrolled ? 'rgba(238, 234, 224, 0.92)' : 'rgba(238, 234, 224, 0.7)');
  const border  = dark ? C.ink3 : `${C.ink}12`;
  const linkColor = dark ? C.text : C.ink;
  const hover = C.accent;
  const mobilePanelBg = dark ? 'rgba(10, 14, 24, 0.96)' : 'rgba(238, 234, 224, 0.97)';

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: surface,
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: `1px solid ${scrolled ? border : 'transparent'}`,
      transition: 'background 220ms ease, border-color 220ms ease',
    }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto',
        padding: '14px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16,
      }}>
        <a href="index.html" onClick={() => setOpen(false)} style={{
          textDecoration: 'none', color: linkColor,
          display: 'inline-flex', alignItems: 'center',
        }}>
          <Lockup size={20} ink={dark ? C.bone : C.ink} accent={C.accent} color={linkColor} />
        </a>

        <div
          className={`bp-nav-links ${open ? 'is-open' : ''}`}
          style={open ? { background: mobilePanelBg } : undefined}
        >
          {NAV_ITEMS.map((it) => (
            <a key={it.id} href={it.href} onClick={() => setOpen(false)} style={{
              fontFamily: DISPLAY, fontSize: 14, fontWeight: 500,
              color: linkColor, textDecoration: 'none',
              borderBottom: active === it.id ? `2px solid ${C.accent}` : '2px solid transparent',
              paddingBottom: 2,
              transition: 'color 120ms ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = hover}
            onMouseLeave={(e) => e.currentTarget.style.color = linkColor}
            >{it.label}</a>
          ))}
          <a href="contact.html" onClick={() => setOpen(false)} style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '11px 18px', borderRadius: 8,
            background: dark ? C.accent : C.ink,
            color: dark ? C.ink : C.bone,
            fontFamily: DISPLAY, fontSize: 13, fontWeight: 600,
            textDecoration: 'none', letterSpacing: '-0.005em', whiteSpace: 'nowrap',
          }}>
            Start a project <span style={{ fontFamily: MONO, fontWeight: 500 }}>→</span>
          </a>
        </div>

        <button
          className="bp-nav-burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{ color: linkColor }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <g><line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" /></g>
            ) : (
              <g><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></g>
            )}
          </svg>
        </button>
      </div>
    </nav>
  );
}

// ─── Footer (always dark) ────────────────────────────────────
function Footer() {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const cols = [
    {
      title: 'Services',
      links: [
        ['Mobile apps',         'services.html#mobile'],
        ['Web development',     'services.html#web'],
        ['Software',            'services.html#software'],
        ['Blockchain',          'services.html#blockchain'],
        ['Product & design',    'services.html#product'],
        ['Game development',    'services.html#games'],
        ['Cloud & DevOps',      'services.html#cloud'],
        ['Emerging tech',       'services.html#emerging'],
      ],
    },
    {
      title: 'Industries',
      links: [
        ['Healthcare',          'industries.html'],
        ['Finance',             'industries.html'],
        ['Ecommerce',           'industries.html'],
        ['Education',           'industries.html'],
        ['Logistics',           'industries.html'],
        ['Real Estate',         'industries.html'],
        ['Hospitality',         'industries.html'],
        ['All sixteen →',       'industries.html'],
      ],
    },
    {
      title: 'Studio',
      links: [
        ['About',               'about.html'],
        ['Selected work',       'portfolio.html'],
        ['Contact',             'contact.html'],
        ['Schedule a call',     'contact.html#schedule'],
        ['Careers',             '#'],
        ['Journal',             '#'],
      ],
    },
  ];
  return (
    <footer style={{
      background: C.ink, color: C.text,
      padding: isMobile ? '80px 22px 32px' : '120px 40px 40px',
      fontFamily: DISPLAY,
      position: 'relative', overflow: 'hidden',
    }}>
      <Glow color={C.accent} position="10% 100%" size="55%" opacity={0.18} />
      <div style={{ maxWidth: 1240, margin: '0 auto', position: 'relative' }}>
        <Reveal style={{
          fontFamily: DISPLAY, fontSize: 'clamp(72px, 16vw, 220px)',
          fontWeight: 700, letterSpacing: '-0.06em', lineHeight: 0.85,
          marginBottom: isMobile ? 48 : 80,
          background: `linear-gradient(180deg, ${C.text}, ${C.text}40 90%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          wordBreak: 'break-word',
        }}>beneplus</Reveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr 1fr 1fr',
          gap: isMobile ? 40 : 60,
        }}>
          <div>
            <Lockup size={24} ink={C.bone} accent={C.accent} color={C.text} />
            <p style={{
              fontSize: 16, lineHeight: 1.55, color: C.textDim, marginTop: 24, maxWidth: 340,
              fontWeight: 400,
            }}>
              A software studio building mobile, web, and emerging-tech products with founders and teams who care about craft.
            </p>
            <div style={{
              fontFamily: MONO, fontSize: 12, color: C.textDim, marginTop: 24, lineHeight: 1.7,
              letterSpacing: '0.02em',
            }}>
              hello@beneplus.dev<br />
              +1 415 555 0117
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <div style={{
                fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: C.accent, fontWeight: 500,
                marginBottom: 18,
              }}>{col.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.links.map(([t, h]) => (
                  <li key={t}>
                    <a href={h} style={{
                      fontFamily: DISPLAY, fontSize: 15, color: C.text,
                      textDecoration: 'none', fontWeight: 400,
                      transition: 'color 160ms ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = C.accent}
                    onMouseLeave={(e) => e.currentTarget.style.color = C.text}
                    >{t}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: isMobile ? 48 : 80, paddingTop: 24, borderTop: `1px solid ${C.ink3}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: MONO, fontSize: 11, color: C.textDim, letterSpacing: '0.08em',
          flexWrap: 'wrap', gap: 12,
        }}>
          <span>© 2026 BENEPLUS</span>
          {!isMobile && <span>// software, shipped faster — for less.</span>}
          <span>BENEPLUS.DEV</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Page shell ──────────────────────────────────────────────
function PageShell({ active, children, navVariant = 'light' }) {
  return (
    <div style={{
      background: C.bone, color: C.ink,
      fontFamily: DISPLAY, minHeight: '100vh',
    }}>
      <Nav active={active} variant={navVariant} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

// ─── Page hero (default for inner pages) ────────────────────
function PageHero({ eyebrow, title, body, mark, bg = C.bone, fg = C.ink, accent = C.accent }) {
  return (
    <section style={{ background: bg, color: fg, padding: '88px 22px 80px' }}>
      <div className="bp-hero" style={{ maxWidth: 1240, margin: '0 auto' }}>
        <Reveal>
          {eyebrow && (
            <div style={{
              fontFamily: MONO, fontSize: 12, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: accent, fontWeight: 500,
              marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ width: 16, height: 1, background: accent, opacity: 0.7 }} />
              {eyebrow}
            </div>
          )}
          <h1 className="bp-h1" style={{ color: fg, maxWidth: 760 }}>{title}</h1>
          {body && (
            <p style={{
              fontFamily: DISPLAY, fontSize: 19, lineHeight: 1.55,
              color: C.mute, maxWidth: 540, marginTop: 28, fontWeight: 400,
            }}>{body}</p>
          )}
        </Reveal>
        <Reveal delay={120} className="bp-hero-mark" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {mark || <Mark size={240} ink={fg === C.text ? C.bone : C.ink} accent={accent} animated />}
        </Reveal>
      </div>
    </section>
  );
}

// ─── Eyebrow ────────────────────────────────────────────────
function Eye({ children, color = C.mute }) {
  return (
    <div style={{
      fontFamily: MONO, fontSize: 12, letterSpacing: '0.16em',
      textTransform: 'uppercase', color, fontWeight: 500,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ width: 16, height: 1, background: 'currentColor', opacity: 0.5 }} />
      {children}
    </div>
  );
}

// ─── Icon — semantic glyph in a brand-matching tile ─────────
const ICON_PATHS = {
  // SERVICES
  mobile: <g>
    <path d="M7.5 2.5 H16.5 A2 2 0 0 1 18.5 4.5 V19.5 A2 2 0 0 1 16.5 21.5 H7.5 A2 2 0 0 1 5.5 19.5 V4.5 A2 2 0 0 1 7.5 2.5 Z" />
    <rect x="10.5" y="18.5" width="3" height="1.2" rx="0.6" fill="rgba(0,0,0,0.25)" />
  </g>,
  web: <g>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <rect x="2" y="4" width="20" height="4.5" rx="2" fill="rgba(0,0,0,0.25)" />
  </g>,
  software: <g>
    <rect x="3" y="4" width="18" height="4" rx="1" />
    <rect x="3" y="10" width="18" height="4" rx="1" opacity="0.7" />
    <rect x="3" y="16" width="18" height="4" rx="1" opacity="0.45" />
  </g>,
  blockchain: <g>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" opacity="0.6" />
    <rect x="3" y="14" width="7" height="7" rx="1" opacity="0.6" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </g>,
  product: <g>
    <path d="M14.5 3 L21 9.5 L9.5 21 L3 21 L3 14.5 L14.5 3 Z" />
    <path d="M14 3.5 L20.5 10 L17.5 13 L11 6.5 Z" opacity="0.55" />
  </g>,
  games: <g>
    <path d="M5.5 7.5 H18.5 A4 4 0 0 1 22.5 11.5 V13.5 A3 3 0 0 1 19.5 16.5 C17 16.5 16.5 14.5 14.5 14.5 H9.5 C7.5 14.5 7 16.5 4.5 16.5 A3 3 0 0 1 1.5 13.5 V11.5 A4 4 0 0 1 5.5 7.5 Z" />
    <rect x="5" y="10.5" width="4" height="1" rx="0.5" fill="rgba(0,0,0,0.4)" />
    <rect x="6.5" y="9" width="1" height="4" rx="0.5" fill="rgba(0,0,0,0.4)" />
    <circle cx="16" cy="10.5" r="1" fill="rgba(0,0,0,0.4)" />
    <circle cx="18" cy="12.5" r="1" fill="rgba(0,0,0,0.4)" />
  </g>,
  cloud: <g>
    <path d="M7 19 A5 5 0 0 1 5 9.5 A5.5 5.5 0 0 1 10.5 5 A6 6 0 0 1 16 8 A4.5 4.5 0 0 1 21 12.5 A4.5 4.5 0 0 1 16.5 19 Z" />
  </g>,
  emerging: <g>
    <path d="M12 2 L13.5 10 L22 12 L13.5 14 L12 22 L10.5 14 L2 12 L10.5 10 Z" />
    <circle cx="19" cy="5" r="1" opacity="0.6" />
    <circle cx="5" cy="19" r="0.7" opacity="0.5" />
  </g>,

  // INDUSTRIES
  automotive: <g>
    <path d="M3 14 L4.5 9 A2 2 0 0 1 6.5 7.5 H17.5 A2 2 0 0 1 19.5 9 L21 14 L21 18 A1 1 0 0 1 20 19 H18 A1 1 0 0 1 17 18 V17 H7 V18 A1 1 0 0 1 6 19 H4 A1 1 0 0 1 3 18 Z" />
    <circle cx="7" cy="14.5" r="1.3" fill="rgba(0,0,0,0.35)" />
    <circle cx="17" cy="14.5" r="1.3" fill="rgba(0,0,0,0.35)" />
  </g>,
  b2b: <g>
    <rect x="3.5" y="6" width="17" height="14" rx="1.5" />
    <path d="M9 6 V4.5 A1 1 0 0 1 10 3.5 H14 A1 1 0 0 1 15 4.5 V6" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <rect x="3.5" y="11" width="17" height="1.5" fill="rgba(0,0,0,0.35)" />
    <rect x="11.2" y="9.5" width="1.6" height="4.5" fill="rgba(0,0,0,0.35)" />
  </g>,
  healthcare: <g>
    <path d="M10 3 H14 V9 H20 V14 H14 V21 H10 V14 H4 V9 H10 Z" />
  </g>,
  education: <g>
    <path d="M2 10 L12 5 L22 10 L12 15 Z" />
    <path d="M6.5 12 L6.5 17 Q12 20 17.5 17 L17.5 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="22" y1="10" x2="22" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </g>,
  ecommerce: <g>
    <path d="M5 7 H19 L17.5 18 A2 2 0 0 1 15.5 19.8 H8.5 A2 2 0 0 1 6.5 18 Z" />
    <path d="M9 7 V5 A3 3 0 0 1 15 5 V7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </g>,
  food: <g>
    <path d="M6.5 3 V11 Q6.5 12.5 5 12.5 Q3.5 12.5 3.5 11 V3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <rect x="4.7" y="12.5" width="0.6" height="8.5" />
    <path d="M14 3 Q12 4 12 8 Q12 11 14 11 V21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <ellipse cx="18.5" cy="6.5" rx="2.5" ry="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <line x1="18.5" y1="10" x2="18.5" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </g>,
  travel: <g>
    <path d="M2 13 L22 5 L19 14 L11 16 L9 21 L7 16 L5 15 Z" />
  </g>,
  fashion: <g>
    <path d="M8 3 L11 5.5 L13 5.5 L16 3 L21 6 L18 11 L16 10 V20 H8 V10 L6 11 L3 6 Z" />
  </g>,
  crm: <g>
    <circle cx="8" cy="8" r="3" />
    <circle cx="16" cy="8" r="3" opacity="0.7" />
    <path d="M2 20 Q2 14 8 14 Q14 14 14 20 Z" />
    <path d="M11 20 Q11 14 16 14 Q22 14 22 20 Z" opacity="0.7" />
  </g>,
  logistics: <g>
    <path d="M2 8 L12 3 L22 8 L12 13 Z" />
    <path d="M2 8 V18 L12 23 V13 Z" opacity="0.5" />
    <path d="M12 13 V23 L22 18 V8 Z" opacity="0.75" />
  </g>,
  manufacturing: <g>
    <path d="M12 2 L13.5 4.5 L16.5 3.5 L17 6.5 L20 7 L19 9.8 L21.5 11.5 L19.5 13.5 L20.5 16.5 L17.5 17 L17 20 L14.5 18.5 L12.5 21 L10.5 18.5 L8 20 L7.5 17 L4.5 16.5 L5.5 13.5 L3.5 11.5 L6 9.8 L5 7 L8 6.5 L8.5 3.5 L11.5 4.5 Z" />
    <circle cx="12" cy="12" r="3.2" fill="rgba(0,0,0,0.35)" />
  </g>,
  legal: <g>
    <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="4" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M2.5 13 L6 6 L9.5 13 Z" />
    <path d="M14.5 13 L18 6 L21.5 13 Z" />
    <line x1="8" y1="20" x2="16" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </g>,
  agriculture: <g>
    <path d="M12 21 Q12 13 5 11 Q4.5 16 8 19 Q11 21 12 21 Z" />
    <path d="M12 21 Q12 11 19 8 Q20 13 16.5 17 Q13.5 20 12 21 Z" opacity="0.7" />
    <line x1="12" y1="21" x2="12" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
  </g>,
  finance: <g>
    <rect x="3" y="14" width="3.5" height="7" rx="0.5" opacity="0.55" />
    <rect x="8.5" y="9" width="3.5" height="12" rx="0.5" opacity="0.8" />
    <rect x="14" y="11" width="3.5" height="10" rx="0.5" opacity="0.7" />
    <rect x="19.5" y="4" width="3.5" height="17" rx="0.5" transform="translate(-1)" />
    <path d="M3 12 L9 7 L14 9 L21 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </g>,
  realestate: <g>
    <path d="M3 11 L12 3 L21 11 V20 A1 1 0 0 1 20 21 H15 V14 H9 V21 H4 A1 1 0 0 1 3 20 Z" />
  </g>,
  hospitality: <g>
    <path d="M2 11 V20 H4 V18 H20 V20 H22 V13 A3 3 0 0 0 19 10 H10 V13 Q10 14 9 14 H2 Z" />
    <circle cx="6" cy="12.5" r="2" opacity="0.55" />
  </g>,
};

function Icon({ name, size = 48, color = C.ink, accent = C.accent, withAccent = true }) {
  const radius = size * 0.22;
  const path = ICON_PATHS[name];
  const fg = (color === C.ink || color === C.ink2 || color === C.ink3) ? C.bone : C.ink;
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: color, position: 'relative', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {path ? (
        <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62}
          style={{ color: fg }}>
          <g fill="currentColor" stroke="none">{path}</g>
        </svg>
      ) : null}
      {withAccent && (
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '38%', height: '38%',
          background: accent,
          borderTopRightRadius: radius,
          borderBottomLeftRadius: radius * 0.45,
        }} />
      )}
    </div>
  );
}

function CategoryGlyph({ idx = 0, size = 56, color = C.ink, accent = C.accent }) {
  const names = ['mobile', 'web', 'software', 'blockchain', 'product', 'games', 'cloud', 'emerging'];
  const name = names[idx % names.length];
  return <Icon name={name} size={size} color={color} accent={accent} />;
}

Object.assign(window, {
  Nav, Footer, PageShell, PageHero, Eye, Icon, ICON_PATHS, CategoryGlyph,
  useMediaQuery, useReveal, useScrolled, Reveal, NAV_ITEMS,
});
