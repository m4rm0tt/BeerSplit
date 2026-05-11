import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../theme';
import { useApp } from '../context/AppContext';
import PintMark from '../components/PintMark';
import Badge from '../components/Badge';
import Btn from '../components/Btn';
import TabBar from '../components/TabBar';

function CodeInput({ value, onChange, onSubmit, error }) {
  const inputRef = useRef(null);

  return (
    <div>
      <div
        onClick={() => inputRef.current?.focus()}
        style={{ position: 'relative', cursor: 'text', marginTop: 16 }}
      >
        {/* 6 visual character boxes */}
        <div style={{ display: 'flex', gap: 6, pointerEvents: 'none' }}>
          {Array.from({ length: 6 }).map((_, i) => {
            const isCursor = i === value.length;
            const filled  = i < value.length;
            return (
              <div key={i} style={{
                flex: 1, height: 60, borderRadius: 12, background: T.cardWarm,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: T.display, fontSize: 26, color: T.ink,
                boxShadow: isCursor
                  ? `inset 0 0 0 2px ${T.primary}`
                  : filled
                    ? `inset 0 0 0 1.5px ${T.ink}`
                    : `inset 0 0 0 1px ${T.hairline}`,
                transition: 'box-shadow 0.15s',
              }}>
                {filled ? value[i] : ''}
              </div>
            );
          })}
        </div>

        {/* Transparent real input — covers everything, triggers mobile keyboard */}
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={6}
          style={{
            position: 'absolute', inset: 0,
            opacity: 0, fontSize: 26,
            background: 'transparent', border: 'none',
            width: '100%', height: '100%',
            cursor: 'text',
          }}
        />
      </div>
      {error && (
        <div style={{ marginTop: 8, fontSize: 13, color: T.primary }}>{error}</div>
      )}
    </div>
  );
}

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
  const [joining, setJoining] = useState(false);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
  const dayStr = now.toLocaleDateString('fr-FR', { weekday: 'short', hour: '2-digit', minute: '2-digit' });

  const finished = sessions.filter((s) => s.status === 'finished').slice(0, 5);

  const tryJoin = async () => {
    if (code.length < 6) { setJoinErr('Code incomplet — 6 caractères.'); return; }
    setJoining(true);
    const s = await joinSession(code, user?.name);
    setJoining(false);
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

            <CodeInput
              value={code}
              onChange={(v) => { setCode(v); setJoinErr(''); }}
              onSubmit={tryJoin}
              error={joinErr}
            />

            <div style={{ marginTop: 12, fontFamily: T.mono, fontSize: 11, color: T.muted, letterSpacing: 0.8 }}>
              6 caractères — demande-le à l'hôte
            </div>
            <Btn onClick={tryJoin} style={{ marginTop: 14, height: 48, fontSize: 15 }} disabled={code.length < 6 || joining}>
              {joining ? 'Recherche…' : 'Rejoindre'}
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
