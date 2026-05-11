import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../theme';
import { useApp } from '../context/AppContext';
import Btn from '../components/Btn';
import TabBar from '../components/TabBar';

export default function Profile() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="screen" style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}>
      <div className="grain" />
      <div style={{ position: 'relative', padding: 'calc(env(safe-area-inset-top,0px) + 16px) 24px 24px' }}>
        <div style={{ fontFamily: T.display, fontSize: 38, lineHeight: 1.0, letterSpacing: -0.8 }}>Mon profil.</div>
      </div>

      {/* Avatar + name */}
      <div style={{ position: 'relative', padding: '0 24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 36, background: T.ink, color: T.foam,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: T.display, fontSize: 30,
        }}>
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <div style={{ fontFamily: T.display, fontSize: 26, lineHeight: 1 }}>{user?.name}</div>
          <div style={{ fontFamily: T.mono, fontSize: 12, color: T.muted, marginTop: 4 }}>{user?.email}</div>
        </div>
      </div>

      {/* Settings rows */}
      <div style={{ position: 'relative', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          {
            icon: '🍺', label: 'À propos de BeerSplit',
            desc: 'Version 1.0 · Fait avec ❤️ pour les soirées tireuse',
          },
          {
            icon: '📊', label: 'Mes données',
            desc: 'Toutes tes données sont stockées localement sur ton appareil.',
          },
          {
            icon: '🔒', label: 'Confidentialité',
            desc: 'Aucune donnée n\'est envoyée à des serveurs tiers.',
          },
        ].map((item) => (
          <div key={item.label} style={{
            background: T.card, borderRadius: 16, padding: '16px 18px',
            boxShadow: `inset 0 0 0 1px ${T.hairline}`,
            display: 'flex', gap: 14, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: 13, color: T.muted, marginTop: 4, lineHeight: 1.4 }}>{item.desc}</div>
            </div>
          </div>
        ))}

        {/* PWA install hint */}
        <div style={{ background: T.bgDeep, borderRadius: 16, padding: '16px 18px', boxShadow: `inset 0 0 0 1px ${T.hairline}` }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.2, color: T.muted, textTransform: 'uppercase', marginBottom: 8 }}>INSTALLER L'APP</div>
          <p style={{ fontSize: 14, color: T.ink2, margin: '0 0 4px', lineHeight: 1.5 }}>
            <b>iOS :</b> Safari → Partager → « Sur l'écran d'accueil »
          </p>
          <p style={{ fontSize: 14, color: T.ink2, margin: 0, lineHeight: 1.5 }}>
            <b>Android :</b> Chrome → ⋮ → « Installer l'application »
          </p>
        </div>

        <div style={{ marginTop: 8 }}>
          <Btn danger onClick={() => setShowLogoutConfirm(true)}>
            Se déconnecter
          </Btn>
        </div>
      </div>

      {showLogoutConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div onClick={() => setShowLogoutConfirm(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,6,0.5)' }} />
          <div style={{
            position: 'relative', background: T.bg, borderRadius: '28px 28px 0 0',
            padding: `24px 24px calc(env(safe-area-inset-bottom,0px) + 36px)`,
            boxShadow: '0 -20px 40px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontFamily: T.display, fontSize: 28, marginBottom: 8 }}>Se déconnecter ?</div>
            <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.5, marginBottom: 20 }}>
              Tes données restent sur cet appareil. Tu pourras te reconnecter avec le même email.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Btn danger onClick={handleLogout}>Confirmer la déconnexion</Btn>
              <Btn onClick={() => setShowLogoutConfirm(false)}>Annuler</Btn>
            </div>
          </div>
        </div>
      )}

      <TabBar />
    </div>
  );
}
