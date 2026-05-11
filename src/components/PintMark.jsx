import { T } from '../theme';

export default function PintMark({ size = 28, color = T.primary }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M8 5h16l-2 22a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3L8 5z"
        stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M9.5 12h13" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <circle cx="13" cy="9" r="0.9" fill={color} />
      <circle cx="16" cy="8.2" r="0.9" fill={color} />
      <circle cx="19" cy="9" r="0.9" fill={color} />
    </svg>
  );
}
