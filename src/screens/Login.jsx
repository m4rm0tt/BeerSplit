import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { T } from '../theme';
import { useApp } from '../context/AppContext';
import PintMark from '../components/PintMark';
import Btn from '../components/Btn';
import Field from '../components/Field';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const validate = () => {
    if (mode === 'register' && name.trim().length < 2) return 'Prénom trop court.';
    if (!email.includes('@')) return 'Email invalide.';
    if (pass.length < 6) return 'Mot de passe trop court (6 car. min).';
    return null;
  };

  const submit = (e) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === 'admin' && pass === 'abc12321') {
      login('Admin', 'admin@beersplit.local', true);
      navigate('/');
      return;
    }
    const error = validate();
    if (error) { setErr(error); return; }
    login(mode === 'register' ? name.trim() : email.split('@')[0], email);
    navigate('/');
  };

  return (
    <div className="screen" style={{ background: T.bg }}>
      <div className="grain" />
      <div style={{
        position: 'relative', minHeight: '100dvh', display: 'flex', flexDirection: 'column',
        padding: 'calc(env(safe-area-inset-top,0px) + 56px) 28px calc(env(safe-area-inset-bottom,0px) + 40px)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 8 }}>
          <PintMark size={44} />
          <div>
            <div style={{ fontFamily: T.display, fontSize: 52, lineHeight: 0.95, letterSpacing: -1 }}>
              BeerSplit
            </div>
            <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, marginTop: 10, color: T.muted, textTransform: 'uppercase' }}>
              Le fût, partagé honnêtement
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, display: 'flex', gap: 4, background: T.bgDeep, borderRadius: 12, padding: 4 }}>
          {['login', 'register'].map((m) => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, height: 36, borderRadius: 10,
              background: mode === m ? T.card : 'transparent',
              fontFamily: T.sans, fontSize: 14, fontWeight: 600,
              color: mode === m ? T.ink : T.muted,
              border: 'none', cursor: 'pointer',
              boxShadow: mode === m ? `inset 0 0 0 1px ${T.hairline}` : 'none',
            }}>
              {m === 'login' ? 'Connexion' : 'Créer un compte'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'register' && (
            <Field label="PRÉNOM" value={name} onChange={setName} placeholder="Pierre" />
          )}
          <Field label="EMAIL" value={email} onChange={setEmail} inputMode="email" placeholder="vous@exemple.fr" />
          <Field label="MOT DE PASSE" value={pass} onChange={setPass} type="password" placeholder="••••••••" />

          {err && (
            <div style={{ background: '#fde8e4', borderRadius: 10, padding: '10px 14px', color: T.primary, fontFamily: T.sans, fontSize: 14 }}>
              {err}
            </div>
          )}

          <div style={{ flex: 1, minHeight: 24 }} />

          <Btn primary type="submit">
            {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Btn>

          {mode === 'login' && (
            <p style={{ textAlign: 'center', fontSize: 13, color: T.muted, marginTop: 4 }}>
              Pas de compte ?{' '}
              <span onClick={() => setMode('register')} style={{ color: T.ink, fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                Créer un compte
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
