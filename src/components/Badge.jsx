import { T } from '../theme';

const TONES = {
  amber: { bg: '#fce6b8', fg: T.ink },
  ink:   { bg: T.ink,     fg: T.foam },
  ember: { bg: T.primary, fg: T.foam },
  foam:  { bg: '#fff',    fg: T.ink2 },
  green: { bg: '#dde8c4', fg: T.green },
};

export default function Badge({ children, tone = 'amber', style }) {
  const c = TONES[tone] || TONES.amber;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: c.bg, color: c.fg,
      fontFamily: T.mono, fontSize: 10, fontWeight: 500,
      textTransform: 'uppercase', letterSpacing: 0.8,
      padding: '4px 8px', borderRadius: 4,
      ...style,
    }}>
      {children}
    </span>
  );
}
