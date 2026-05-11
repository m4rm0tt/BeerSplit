import { useNavigate, useLocation } from 'react-router-dom';
import { T } from '../theme';

const TABS = [
  { path: '/',         label: 'Accueil',    icon: HomeIcon },
  { path: '/stats',    label: 'Stats',      icon: StatsIcon },
  { path: '/history',  label: 'Historique', icon: HistoryIcon },
  { path: '/profile',  label: 'Profil',     icon: ProfileIcon },
];

export default function TabBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      height: `calc(64px + env(safe-area-inset-bottom, 0px))`,
      background: 'rgba(239,226,196,0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: `1px solid ${T.hairline}`,
      display: 'flex', alignItems: 'flex-start', paddingTop: 8,
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      zIndex: 100,
    }}>
      {TABS.map(({ path, label, icon: Icon }) => {
        const active = pathname === path;
        return (
          <button key={path} onClick={() => navigate(path)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
            color: active ? T.ink : T.muted,
            touchAction: 'manipulation',
          }}>
            <Icon active={active} />
            <span style={{ fontFamily: T.sans, fontSize: 10, fontWeight: 600, letterSpacing: 0.2 }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function HomeIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 12L12 3l9 9" stroke="currentColor" strokeWidth={active ? 2.2 : 1.6} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth={active ? 2.2 : 1.6} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function StatsIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 20V14M9 20V8M14 20V12M19 20V4" stroke="currentColor" strokeWidth={active ? 2.2 : 1.6} strokeLinecap="round"/>
    </svg>
  );
}

function HistoryIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={active ? 2.2 : 1.6}/>
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth={active ? 2.2 : 1.6} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ProfileIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth={active ? 2.2 : 1.6}/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth={active ? 2.2 : 1.6} strokeLinecap="round"/>
    </svg>
  );
}
