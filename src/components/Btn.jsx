import { T } from '../theme';

export default function Btn({ children, primary, danger, style, onClick, disabled, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', height: 56, border: 'none', borderRadius: 14,
        background: danger ? '#c0392b' : primary ? T.ink : T.cardWarm,
        color: (primary || danger) ? T.foam : T.ink,
        fontFamily: T.sans, fontSize: 17, fontWeight: 600, letterSpacing: -0.2,
        boxShadow: primary ? `0 4px 0 ${T.primaryDk}` : danger ? '0 4px 0 #922b21' : `inset 0 0 0 1px ${T.hairline}`,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        transition: 'opacity 0.15s',
        touchAction: 'manipulation',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
