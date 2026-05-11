import { T } from '../theme';

export default function Field({ label, value, onChange, placeholder, type = 'text', inputMode, pattern }) {
  return (
    <div style={{
      background: T.card, borderRadius: 14, padding: '14px 18px',
      boxShadow: `inset 0 0 0 1px ${T.hairline}`,
    }}>
      <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, color: T.muted }}>
        {label}
      </div>
      <input
        type={type}
        inputMode={inputMode}
        pattern={pattern}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          fontSize: 17, fontWeight: 500, marginTop: 4, width: '100%',
          background: 'none', border: 'none', padding: 0,
          letterSpacing: type === 'password' ? 3 : -0.2,
          color: T.ink,
        }}
      />
    </div>
  );
}
