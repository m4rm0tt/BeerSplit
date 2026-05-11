import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../theme';
import { useApp } from '../context/AppContext';
import PintMark from '../components/PintMark';
import Badge from '../components/Badge';
import Btn from '../components/Btn';
import TabBar from '../components/TabBar';

function fmtDate(ts) {
  return new Date(ts).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

function sessionBalance(session, userId) {
  const rate = session.volume > 0 ? session.price / session.volume : 0;
  const myVol = session.drinks.filter((d) => d.participantId === userId).reduce((a, d) => a + d.vol, 0);
  return myVol * rate;
}

export default function Home() {
  const { user, sessions, activeSession, joinSession } = useApp();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [joinErr, setJoinErr] = useState('');
  const [guestName, setGuestName] = useState('');
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [pendingSession, setPendingSession] = useState(null);
  const inputRefs = useRef([]);
  const codeArr = code.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6).split('');

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
  const dayStr = now.toLocaleDateString('fr-FR', { weekday: 'short', hour: '2-digit', minute: '2-digit' });

  const finished = sessions.filter((s) => s.status === 'finished').slice(0, 5);

  const handleCodeKey = (i, e) => {
    const char = e.key.toUpperCase();
    if (/^[A-Z0-9]$/.test(char)) {
      const arr = codeArr.slice();
      arr[i] = char;
      setCode(arr.join(''));
      if (i < 5) inputRefs.current[i + 1]?.focus();
    } else if (e.key === 'Backspace') {
      const arr = codeArr.slice();
      arr[i] = undefined;
      setCode(arr.filter(Boolean).join(''));
      if (i > 0) inputRefs.current[i - 1]?.focus();
    }
    e.preventDefault();
  };

  const tryJoin = () => {
    if (code.length < 6) { setJoinErr('Code incomplet — 6 caractères.'); return; }
    const s = joinSession(code, user?.name || guestName);
    if (!s) { setJoinErr('Session introuvable ou terminée.'); return; }
    navigate(`/session/${s.id}`);
  };

  return (
    <div className="screen" style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}>
      <div className="grain" />

      {/* Header */}
      <div style={{ position: 'relative', padding: 'calc(env(safe-area-inset-top,0px) + 16px) 24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <PintMark size={24} />
          <span style={{ fontFamily: T.display, fontSize: 24 }}>BeerSplit</span>
        </div>
        <div onClick={() => navigate('/profile')} style={{
          width: 36, height: 36, borderRadius: 18, background: T.ink, color: T.foam,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: T.display, fontSize: 16, cursor: 'pointer',
        }}>
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>

      {/* Salutation */}
      <div style={{ position: 'relative', padding: '0 24px 28px' }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.muted, textTransform: 'uppercase' }}>
          {greeting}, {user?.name} — {dayStr.charAt(0).toUpperCase() + dayStr.slice(1)}
        </div>
        {activeSession ? (
          <>
            <div style={{ fontFamily: T.display, fontSize: 34, lineHeight: 1.02, marginTop: 10, letterSpacing: -0.8 }}>
              Fût en cours.
            </div>
            <div style={{ fontSize: 14, color: T.muted, marginTop: 6 }}>
              {activeSession.brewery} — {activeSession.beer}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: T.display, fontSize: 34, lineHeight: 1.02, marginTop: 10, letterSpacing: -0.8 }}>
              Aucun fût en perce.
            </div>
            <div style={{ fontSize: 14, color: T.muted, marginTop: 6, maxWidth: 280, lineHeight: 1.4 }}>
              Mets-en un en route, ou rejoins celui d'un copain.
            </div>
          </>
        )}
      </div>

      <div style={{ position: 'relative', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Active session shortcut OR create card */}
        {activeSession ? (
          <div onClick={() => navigate(`/session/${activeSession.id}`)} style={{
            background: T.ink, color: T.foam, borderRadius: 24, padding: '22px',
            position: 'relative', overflow: 'hidden', cursor: 'pointer',
          }}>
            <div style={{ position: 'absolute', right: -20, top: -10, opacity: 0.18 }}>
              <PintMark size={120} color={T.foam} />
            </div>
            <Badge tone="ember" style={{ position: 'relative' }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: T.foam, display: 'inline-block' }} />
              EN COURS · {activeSession.code}
            </Badge>
            <div style={{ fontFamily: T.display, fontSize: 28, lineHeight: 1.0, marginTop: 14, letterSpacing: -0.4, position: 'relative' }}>
              Reprendre la session
            </div>
            <div style={{ fontSize: 13, color: 'rgba(254,248,232,0.65)', marginTop: 6, position: 'relative' }}>
              {activeSession.drinks.length} bières · {activeSession.participants.length} participants
            </div>
            <div style={{
              marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 8,
              background: T.primary, color: T.foam, borderRadius: 12, padding: '10px 16px',
              fontSize: 14, fontWeight: 600, position: 'relative',
            }}>
              Ouvrir
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        ) : (
          <div style={{
            background: T.ink, color: T.foam, borderRadius: 24, padding: '22px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -20, top: -10, opacity: 0.18 }}>
              <PintMark size={120} color={T.foam} />
            </div>
            <Badge tone="ember" style={{ position: 'relative' }}>Nouveau fût</Badge>
            <div style={{ fontFamily: T.display, fontSize: 28, lineHeight: 1.0, marginTop: 14, letterSpacing: -0.4, position: 'relative' }}>
              Mettre en perce
            </div>
            <div style={{ fontSize: 13, color: 'rgba(254,248,232,0.65)', marginTop: 6, position: 'relative' }}>
              Crée une session, invite tes potes par code
            </div>
            <button onClick={() => navigate('/create')} style={{
              marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 8,
              background: T.primary, color: T.foam, borderRadius: 12, padding: '10px 16px',
              fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
              position: 'relative', touchAction: 'manipulation',
            }}>
              Commencer
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}

        {/* Join card */}
        {!activeSession && (
          <div style={{ background: T.card, borderRadius: 24, padding: '22px', boxShadow: `inset 0 0 0 1px ${T.hairline}` }}>
            <Badge tone="amber">Rejoindre</Badge>
            <div style={{ fontFamily: T.display, fontSize: 24, marginTop: 12, letterSpacing: -0.3 }}>
              Code de session
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 6 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ flex: 1 }}>
                  {i === 3 && (
                    <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.display, fontSize: 22, color: T.muted }}>—</div>
                  )}
                  {i !== 3 && (
                    <div
                      ref={(el) => (inputRefs.current[i] = el)}
                      tabIndex={0}
                      onKeyDown={(e) => handleCodeKey(i, e)}
                      onFocus={(e) => e.target.style.boxShadow = `inset 0 0 0 2px ${T.primary}`}
                      onBlur={(e) => e.target.style.boxShadow = `inset 0 0 0 1.5px ${codeArr[i] ? T.ink : T.hairline}`}
                      style={{
                        height: 56, borderRadius: 12, background: T.cardWarm,
                        boxShadow: `inset 0 0 0 1.5px ${codeArr[i] ? T.ink : T.hairline}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: T.display, fontSize: 24, color: T.ink,
                        cursor: 'text', userSelect: 'none',
                      }}
                    >
                      {codeArr[i] || ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Hidden real input for mobile keyboard */}
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
              onFocus={() => inputRefs.current[code.length]?.focus?.()}
              style={{ position: 'absolute', opacity: 0, width: 1, height: 1, pointerEvents: 'none' }}
              inputMode="text"
              maxLength={6}
            />
            {joinErr && <div style={{ marginTop: 8, fontSize: 13, color: T.primary }}>{joinErr}</div>}
            <div style={{ marginTop: 12, fontFamily: T.mono, fontSize: 11, color: T.muted, letterSpacing: 0.8 }}>
              6 caractères — demande-le à l'hôte
            </div>
            <Btn onClick={tryJoin} style={{ marginTop: 14, height: 48, fontSize: 15 }}>
              Rejoindre
            </Btn>
          </div>
        )}
      </div>

      {/* Historique */}
      {finished.length > 0 && (
        <>
          <div style={{ position: 'relative', padding: '32px 24px 8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, color: T.muted, textTransform: 'uppercase' }}>
              Fûts récents
            </span>
            <span onClick={() => navigate('/history')} style={{ fontSize: 13, color: T.primary, fontWeight: 500, cursor: 'pointer' }}>
              Tout voir
            </span>
          </div>
          <div style={{ position: 'relative', padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {finished.map((s) => {
              const bal = sessionBalance(s, user?.id);
              return (
                <div key={s.id} onClick={() => navigate(`/split/${s.id}`)} style={{
                  background: T.cardWarm, borderRadius: 16, padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  boxShadow: `inset 0 0 0 1px ${T.hairline}`, cursor: 'pointer',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, background: T.bgDeep,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <PintMark size={22} color={T.ink2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.brewery} — {s.beer}
                    </div>
                    <div style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, marginTop: 3 }}>
                      {fmtDate(s.startDate)} · {s.volume} L · {s.drinks.length} bières
                    </div>
                  </div>
                  <div style={{ fontFamily: T.display, fontSize: 18, color: T.primary, flexShrink: 0 }}>
                    {bal.toFixed(2)} €
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <TabBar />
    </div>
  );
}
