// ─────────────────────────────────────────────────────────────
// Beneplus — Brand identity (v5)
// ─────────────────────────────────────────────────────────────
// Mark: a rounded slate tile with a vermillion corner-cut triangle.
// Wordmark: lowercase "beneplus" set in Geist 700, tight tracking.
// Mode: dark-mode-first. Bone surfaces for secondary use.

const C = {
  // grounds
  ink:        '#0A0E18',   // primary dark ground
  ink2:       '#11172A',   // raised
  ink3:       '#1A2138',   // border / line
  ink4:       '#272F4A',   // hover line / subtle highlight
  // light
  bone:       '#EEEAE0',   // warm refined cream (cooler than v4)
  bone2:      '#E0DBCD',
  paper:      '#F7F4ED',
  // accents
  accent:     '#FF5A35',   // vermillion, brighter for dark mode
  accent2:    '#3FD8AF',   // signal mint (sparingly)
  accentSoft: '#FF8160',
  // text
  text:       '#F2EFE6',   // text on dark
  textDim:    '#9099A8',   // dim text on dark
  mute:       '#6B7184',   // mid gray (works on both)
  subtle:     '#4A5167',
  // legacy aliases (so existing pages keep working)
  slate:      '#0A0E18',
  slate2:     '#11172A',
  slate3:     '#1A2138',
  vermillion: '#FF5A35',
};

const DISPLAY = '"Plus Jakarta Sans", "Inter", system-ui, sans-serif';
const MONO    = '"JetBrains Mono", "Geist Mono", ui-monospace, monospace';

// ─────────────────────────────────────────────────────────────
// The Mark — 2×2 quadrant. Three squares in `ink`, one in `accent`.
// On light surfaces: ink=slate, accent=vermillion.
// On dark surfaces: pass ink={C.bone} so the three squares flip to cream.
// ─────────────────────────────────────────────────────────────
function Mark({
  size = 240,
  ink = C.ink,
  accent = C.accent,
  accentPos = 'tr',
  animated = false,
  glow = false,
  ground,            // legacy alias — ignored; parent surface shows through
}) {
  const cells = {
    tl: [accent, ink, ink, ink],
    tr: [ink, accent, ink, ink],
    bl: [ink, ink, accent, ink],
    br: [ink, ink, ink, accent],
  }[accentPos];
  const gap    = size * 0.07;
  const radius = size * 0.14;
  const cell   = (size - gap) / 2;
  return (
    <div style={{
      width: size, height: size, position: 'relative', display: 'inline-block',
      filter: glow ? `drop-shadow(0 0 ${size * 0.16}px ${accent}55)` : undefined,
      animation: animated ? 'bp-pulse 1s ease-in-out infinite' : undefined,
      transformOrigin: 'center center',
      willChange: animated ? 'transform' : undefined,
    }}>
      {animated && (
        <style>{`
          @keyframes bp-pulse {
            0%, 100% { transform: scale(1); }
            50%      { transform: scale(1.045); }
          }
        `}</style>
      )}
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ display: 'block' }}>
        {cells.map((c, i) => {
          const row = i < 2 ? 0 : 1;
          const col = i % 2;
          const x = col * (cell + gap);
          const y = row * (cell + gap);
          return (
            <rect
              key={i}
              x={x} y={y} width={cell} height={cell} rx={radius} ry={radius}
              fill={c}
            />
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Wordmark — "Beneplus" capital B, Geist 700, tight tracking
// ─────────────────────────────────────────────────────────────
function Wordmark({ size = 80, color = C.ink, weight = 700, tracking = '-0.045em' }) {
  return (
    <span style={{
      fontFamily: DISPLAY, fontWeight: weight,
      fontSize: size, lineHeight: 1, letterSpacing: tracking,
      color, display: 'inline-block',
    }}>Beneplus</span>
  );
}

// Lockup — mark + wordmark horizontally
function Lockup({ size = 80, ink = C.ink, accent = C.accent, color = C.ink, animated = false, ground }) {
  const markSize = size * 1.35;
  const gap = size * 0.42;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap }}>
      <Mark size={markSize} ink={ink} accent={accent} animated={animated} />
      <Wordmark size={size} color={color} />
    </span>
  );
}

// Stacked lockup
function StackedLockup({ size = 80, ink = C.ink, accent = C.accent, color = C.ink, ground }) {
  const markSize = size * 1.9;
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.42 }}>
      <Mark size={markSize} ink={ink} accent={accent} />
      <Wordmark size={size} color={color} />
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function Section({ bg = C.bone, fg = C.ink, children, pad = '120px 80px', minH = 'auto' }) {
  return (
    <section style={{
      background: bg, color: fg,
      padding: pad, minHeight: minH,
      position: 'relative',
      fontFamily: DISPLAY,
    }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', position: 'relative' }}>
        {children}
      </div>
    </section>
  );
}

function Eyebrow({ children, color }) {
  return (
    <div style={{
      fontFamily: MONO, fontSize: 12, letterSpacing: '0.16em',
      textTransform: 'uppercase', fontWeight: 500,
      color: color || C.mute, marginBottom: 24,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ width: 16, height: 1, background: 'currentColor', opacity: 0.5 }} />
      {children}
    </div>
  );
}
function SectionTitle({ children, color }) {
  return (
    <h2 style={{
      fontFamily: DISPLAY, fontSize: 56, lineHeight: 1.0,
      fontWeight: 600, letterSpacing: '-0.045em', margin: 0,
      color: color || 'inherit', maxWidth: 880,
    }}>{children}</h2>
  );
}
function Body({ children, color, max = 540 }) {
  return (
    <p style={{
      fontFamily: DISPLAY, fontSize: 18, lineHeight: 1.55,
      fontWeight: 400, maxWidth: max,
      color: color || C.mute, margin: 0,
    }}>{children}</p>
  );
}

// Color swatch
function Swatch({ color, name, hex, role, border = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{
        width: '100%', aspectRatio: '1 / 1', background: color,
        borderRadius: 12,
        boxShadow: border ? `inset 0 0 0 1px ${C.ink}1A` : 'none',
      }} />
      <div>
        <div style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>{name}</div>
        <div style={{ fontFamily: MONO, fontSize: 12, color: C.mute, marginTop: 2 }}>{hex}</div>
        <div style={{ fontFamily: DISPLAY, fontSize: 13, color: C.mute, marginTop: 8, lineHeight: 1.45 }}>{role}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Texture — subtle grain overlay (used for premium feel)
// ─────────────────────────────────────────────────────────────
function Grain({ opacity = 0.05 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      opacity, zIndex: 1, mixBlendMode: 'overlay',
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    }} />
  );
}

// Radial glow backdrop for hero sections
function Glow({ color = C.accent, position = '50% 30%', size = '60%', opacity = 0.18 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      background: `radial-gradient(${size} 50% at ${position}, ${color}${Math.round(opacity*255).toString(16).padStart(2,'0')}, transparent 70%)`,
    }} />
  );
}

// ─────────────────────────────────────────────────────────────
// Code window — for hero mockup imagery
// ─────────────────────────────────────────────────────────────
function CodeWindow({ width = 520, height = 380 }) {
  return (
    <div style={{
      width, height, borderRadius: 14,
      background: '#0E1422',
      boxShadow: '0 40px 80px -30px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      fontFamily: MONO,
    }}>
      {/* chrome */}
      <div style={{
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8,
        borderBottom: `1px solid ${C.ink3}`,
      }}>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#FF5F57' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#FEBC2E' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28C840' }} />
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: C.mute, letterSpacing: '0.04em' }}>beneplus/ship.ts</span>
      </div>
      {/* code */}
      <div style={{
        flex: 1, padding: 22,
        fontFamily: MONO, fontSize: 13, lineHeight: 1.7, color: C.text,
        display: 'flex', flexDirection: 'column',
      }}>
        <CodeLine n={1}><span style={{ color: '#A78BFA' }}>import</span>{' { '}<span style={{ color: '#FFB454' }}>build</span>{', '}<span style={{ color: '#FFB454' }}>ship</span>{' }'} <span style={{ color: '#A78BFA' }}>from</span> <span style={{ color: '#3FD8AF' }}>'@beneplus/core'</span></CodeLine>
        <CodeLine n={2}>&nbsp;</CodeLine>
        <CodeLine n={3}><span style={{ color: '#A78BFA' }}>export const</span> <span style={{ color: '#67E8F9' }}>product</span> {'= '}<span style={{ color: '#A78BFA' }}>await</span> <span style={{ color: '#FFB454' }}>build</span>{'({'}</CodeLine>
        <CodeLine n={4}>{'  '}<span style={{ color: '#67E8F9' }}>idea</span>{': '}<span style={{ color: '#3FD8AF' }}>'something worth shipping'</span>{','}</CodeLine>
        <CodeLine n={5}>{'  '}<span style={{ color: '#67E8F9' }}>team</span>{': '}<span style={{ color: '#3FD8AF' }}>'small, opinionated, fast'</span>{','}</CodeLine>
        <CodeLine n={6}>{'  '}<span style={{ color: '#67E8F9' }}>stack</span>{': ['}<span style={{ color: '#3FD8AF' }}>'react'</span>{', '}<span style={{ color: '#3FD8AF' }}>'rust'</span>{', '}<span style={{ color: '#3FD8AF' }}>'whatever-it-takes'</span>{'],'}</CodeLine>
        <CodeLine n={7}>{'})'}</CodeLine>
        <CodeLine n={8}>&nbsp;</CodeLine>
        <CodeLine n={9}><span style={{ color: '#A78BFA' }}>await</span> <span style={{ color: '#FFB454' }}>ship</span>{'(product, '}<span style={{ color: '#FF5A35' }}>{'{ env: '}</span><span style={{ color: '#3FD8AF' }}>'prod'</span><span style={{ color: '#FF5A35' }}>{' }'}</span>{')'}</CodeLine>
        <CodeLine n={10}><span style={{ color: '#6E7681' }}>// shipped in 12ms ✓</span></CodeLine>
      </div>
    </div>
  );
}
function CodeLine({ n, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline' }}>
      <span style={{ display: 'inline-block', width: 26, color: '#3E4356', textAlign: 'right', marginRight: 14, fontSize: 11 }}>{n}</span>
      <span>{children}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// App icon phone home screen — keep for brand reveal page
// ─────────────────────────────────────────────────────────────
function PhoneHomeScreen() {
  return (
    <div style={{
      width: 300, height: 620, borderRadius: 48,
      background: C.ink, padding: 14,
      boxShadow: '0 50px 100px -40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)',
      position: 'relative',
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 36,
        background: `linear-gradient(180deg, #1A1F2D 0%, ${C.ink} 100%)`,
        position: 'relative', overflow: 'hidden',
        padding: '50px 24px 24px',
      }}>
        <div style={{
          position: 'absolute', top: 18, left: 24, right: 24,
          display: 'flex', justifyContent: 'space-between',
          fontFamily: DISPLAY, fontSize: 12, fontWeight: 600, color: C.bone,
        }}>
          <span>9:41</span>
          <span style={{ width: 14, height: 8, border: `1px solid ${C.bone}`, borderRadius: 2 }} />
        </div>
        <div style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
          width: 100, height: 28, background: C.ink, borderRadius: 16,
        }} />
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22, marginTop: 30,
        }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              {i === 4
                ? <Mark size={56} />
                : <div style={{ width: 56, height: 56, borderRadius: 14, background: '#3A4252', opacity: 0.7 }} />}
              <span style={{ fontFamily: DISPLAY, fontSize: 9.5, color: C.bone, fontWeight: i === 4 ? 600 : 400 }}>
                {i === 4 ? 'beneplus' : ''}
              </span>
            </div>
          ))}
        </div>
        <div style={{
          position: 'absolute', left: 14, right: 14, bottom: 20,
          padding: '12px 14px', borderRadius: 26,
          background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'space-around',
        }}>
          {[0,1,2,3].map((i) => (
            i === 2 ? <Mark key={i} size={48} />
                   : <div key={i} style={{ width: 48, height: 48, borderRadius: 11, background: '#3A4252', opacity: 0.7 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  C, DISPLAY, MONO,
  Mark, Wordmark, Lockup, StackedLockup,
  Section, Eyebrow, SectionTitle, Body, Swatch,
  Grain, Glow, CodeWindow, CodeLine, PhoneHomeScreen,
});
