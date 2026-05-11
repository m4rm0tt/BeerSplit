import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { T, SIZES } from '../theme';
import { useApp } from '../context/AppContext';
import { getSession, subscribeToSession, upsertSession } from '../utils/storage';
import PintMark from '../components/PintMark';
import Badge from '../components/Badge';
import Btn from '../components/Btn';

function computeLeaderboard(session) {
  const rate = session.volume > 0 ? (session.price + (session.surcharge || 0)) / session.volume : 0;
  const map = {};
  session.participants.forEach((p) => { map[p.id] = { ...p, vol: 0, beers: 0, owed: 0 }; });
  session.drinks.forEach((d) => {
    if (map[d.participantId]) {
      map[d.participantId].vol += d.vol;
      map[d.participantId].beers++;
    }
  });
  Object.values(map).forEach((p) => { p.owed = p.vol * rate; });
  return Object.values(map).sort((a, b) => b.vol - a.vol);
}

function pct(session) {
  const drunk = session.drinks.reduce((a, d) => a + d.vol, 0);
  return Math.min(100, Math.round((drunk / session.volume) * 100));
}

export default function Session() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addDrink, undoLastDrink, finishSession, removeParticipant, refresh } = useApp();
  const [session, setSession] = useState(() => getSession(id));
  const [showSheet, setShowSheet] = useState(false);
  const [selectedSize, setSelectedSize] = useState('demi');
  const [selectedFor, setSelectedFor] = useState(null);
  const [bumping, setBumping] = useState(false);
  const [undoVisible, setUndoVisible] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const undoTimer = useRef(null);
  const pressTimer = useRef(null);

  useEffect(() => {
    const s = getSession(id);
    if (!s) { navigate('/'); return; }
    setSession(s);
    setSelectedFor(user?.id || s.participants[0]?.id);
  }, [id]);

  const reload = useCallback(() => {
    const s = getSession(id);
    if (s) setSession(s);
  }, [id]);

  // Realtime Firebase sync — updates session live on all devices
  useEffect(() => {
    const unsubscribe = subscribeToSession(id, (remote) => {
      const local = getSession(id);
      if (!local || JSON.stringify(remote) !== JSON.stringify(local)) {
        upsertSession(remote);
        setSession(remote);
      }
    });
    return unsubscribe;
  }, [id]);

  const handleQuickAdd = () => {
    if (!session || session.status !== 'active') return;
    const pid = selectedFor || user?.id || session.participants[0]?.id;
    addDrink(id, pid, 0.25);
    setBumping(true);
    setTimeout(() => setBumping(false), 350);
    setUndoVisible(true);
    clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setUndoVisible(false), 10000);
    reload();
    refresh();
  };

  const handleUndo = () => {
    const pid = selectedFor || user?.id || session.participants[0]?.id;
    undoLastDrink(id, pid);
    setUndoVisible(false);
    reload();
    refresh();
  };

  const handleAddFromSheet = () => {
    const sz = SIZES.find((s) => s.id === selectedSize);
    addDrink(id, selectedFor, sz.vol);
    setShowSheet(false);
    setBumping(true);
    setTimeout(() => setBumping(false), 350);
    reload();
    refresh();
  };

  const handleFinish = () => {
    finishSession(id);
    navigate(`/split/${id}`);
  };

  const handleShare = () => {
    const text = `Rejoins notre session BeerSplit ! Code : ${session.code}`;
    if (navigator.share) {
      navigator.share({ title: 'BeerSplit', text });
    } else {
      navigator.clipboard?.writeText(text);
      setShowShare(true);
      setTimeout(() => setShowShare(false), 2000);
    }
  };

  if (!session) return null;

  const lb = computeLeaderboard(session);
  const drunk = session.drinks.reduce((a, d) => a + d.vol, 0);
  const remaining = Math.max(0, session.volume - drunk);
  const pctVal = pct(session);
  const effectivePrice = session.price + (session.surcharge || 0);
  const rate = session.volume > 0 ? effectivePrice / session.volume : 0;
  const myEntry = lb.find((p) => p.id === user?.id);

  return (
    <div className="screen" style={{ background: T.bg }}>
      <div className="grain" />

      {/* Header */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'calc(env(safe-area-inset-top,0px) + 10px) 20px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: T.primary, boxShadow: `0 0 0 4px ${T.primary}33`, display: 'inline-block', animation: 'pulse 2s infinite' }} />
          <Badge tone="ember">EN COURS · {session.code}</Badge>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleShare} style={{
            width: 34, height: 34, borderRadius: 17, background: T.cardWarm,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${T.hairline}`, cursor: 'pointer',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke={T.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button onClick={() => setShowFinishConfirm(true)} style={{
            height: 34, borderRadius: 17, background: T.cardWarm,
            display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px',
            border: `1px solid ${T.hairline}`, cursor: 'pointer', fontFamily: T.sans, fontSize: 13, fontWeight: 500, color: T.ink,
          }}>
            Fût fini
          </button>
        </div>
      </div>

      {showShare && (
        <div style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: T.ink, color: T.foam, borderRadius: 12, padding: '10px 18px', fontSize: 14, fontWeight: 500 }}>
          Code copié !
        </div>
      )}

      {/* Keg info */}
      <div style={{ position: 'relative', padding: '0 24px 16px' }}>
        <div style={{ fontFamily: T.display, fontSize: 28, lineHeight: 1.0, letterSpacing: -0.5 }}>
          {session.beer}
        </div>
        <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>
          {session.brewery} · {session.volume} L · {session.price} €
        </div>
      </div>

      {/* Keg level */}
      <div style={{ position: 'relative', padding: '0 16px 20px' }}>
        <div style={{ background: T.ink, borderRadius: 24, padding: '22px 22px 20px', color: T.foam, overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none', backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`, backgroundSize: '12px 12px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', position: 'relative' }}>
            <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: 'rgba(254,248,232,0.6)' }}>NIVEAU DU FÛT</span>
            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.accent }}>
              {remaining.toFixed(1)} L restants
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 10, position: 'relative' }}>
            <span style={{
              fontFamily: T.display, fontSize: 68, lineHeight: 0.9, letterSpacing: -2,
              animation: bumping ? 'countBump 0.35s ease' : 'none',
              display: 'inline-block',
            }}>
              {pctVal}
            </span>
            <span style={{ fontFamily: T.display, fontSize: 26, color: 'rgba(254,248,232,0.55)' }}>%</span>
            <span style={{ marginLeft: 'auto', fontFamily: T.mono, fontSize: 11, color: 'rgba(254,248,232,0.5)', textTransform: 'uppercase' }}>bu</span>
          </div>
          <div style={{ marginTop: 14, height: 10, borderRadius: 5, background: 'rgba(254,248,232,0.12)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, width: `${pctVal}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.primary})`, borderRadius: 5, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, position: 'relative' }}>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: 'rgba(254,248,232,0.5)' }}>{session.drinks.length} bières comptées</span>
            <span style={{ fontFamily: T.mono, fontSize: 10, color: 'rgba(254,248,232,0.5)' }}>{session.participants.length} participants</span>
          </div>
        </div>
      </div>

      {/* Leaderboard mini */}
      <div style={{ position: 'relative', padding: '0 24px 8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, color: T.muted, textTransform: 'uppercase' }}>Le classement</span>
        <div style={{ display: 'flex', gap: 14 }}>
          <span onClick={() => setShowManage(true)} style={{ fontSize: 13, color: T.muted, fontWeight: 500, cursor: 'pointer' }}>Gérer →</span>
          <span onClick={() => navigate(`/leaderboard/${id}`)} style={{ fontSize: 13, color: T.primary, fontWeight: 500, cursor: 'pointer' }}>Tout voir →</span>
        </div>
      </div>

      <div style={{ position: 'relative', padding: '0 16px 100px' }}>
        {lb.slice(0, 4).map((p, i) => (
          <div key={p.id} style={{
            background: p.id === user?.id ? T.cardWarm : 'transparent',
            borderRadius: 14, padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4,
            boxShadow: p.id === user?.id ? `inset 0 0 0 1.5px ${T.ink}` : 'none',
          }}>
            <span style={{ fontFamily: T.display, fontSize: 20, color: T.muted, width: 20 }}>{i + 1}</span>
            <div style={{
              width: 34, height: 34, borderRadius: 17, background: T.bgDeep,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: T.display, fontSize: 14, color: T.ink2,
            }}>{p.name[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{p.name}{p.id === user?.id && <span style={{ color: T.muted, fontWeight: 400, fontSize: 13 }}> · toi</span>}</div>
              <div style={{ fontFamily: T.mono, fontSize: 10, color: T.muted }}>{p.beers} bières · {p.owed.toFixed(2)} €</div>
            </div>
            <div style={{ width: 52, height: 18, display: 'flex', gap: 2, alignItems: 'flex-end' }}>
              {Array.from({ length: 7 }).map((_, j) => (
                <div key={j} style={{ flex: 1, height: j < Math.min(p.beers, 7) ? '100%' : '25%', background: j < Math.min(p.beers, 7) ? T.primary : T.hairline, borderRadius: 1 }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky CTA */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        padding: `12px 16px calc(env(safe-area-inset-bottom,0px) + 20px)`,
        background: `linear-gradient(0deg, ${T.bg} 60%, transparent)`,
        zIndex: 50,
      }}>
        {undoVisible && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: T.card, borderRadius: 12, padding: '10px 16px', marginBottom: 10,
            boxShadow: `inset 0 0 0 1px ${T.hairline}`,
          }}>
            <span style={{ fontFamily: T.mono, fontSize: 12, color: T.muted }}>Bière ajoutée</span>
            <button onClick={handleUndo} style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.primary, background: 'none', border: 'none', cursor: 'pointer' }}>
              Annuler (10s)
            </button>
          </div>
        )}

        {/* For who selector */}
        {session.participants.length > 1 && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, overflowX: 'auto', paddingBottom: 2 }}>
            {session.participants.map((p) => (
              <button key={p.id} onClick={() => setSelectedFor(p.id)} style={{
                height: 34, borderRadius: 18, padding: '0 14px', flexShrink: 0,
                background: selectedFor === p.id ? T.ink : T.cardWarm,
                color: selectedFor === p.id ? T.foam : T.ink,
                border: `1px solid ${selectedFor === p.id ? 'transparent' : T.hairline}`,
                fontFamily: T.sans, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ width: 20, height: 20, borderRadius: 10, background: selectedFor === p.id ? T.primary : T.bgDeep, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontFamily: T.display, color: selectedFor === p.id ? T.foam : T.ink2 }}>{p.name[0]}</span>
                {p.name}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleQuickAdd}
            style={{
              flex: 1, height: 68, border: 'none', borderRadius: 20,
              background: T.primary, color: T.foam,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 20px 0 22px', cursor: 'pointer',
              boxShadow: `0 6px 0 ${T.primaryDk}, 0 16px 28px ${T.primary}40`,
              touchAction: 'manipulation',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <PintMark size={30} color={T.foam} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: T.display, fontSize: 20, lineHeight: 1 }}>+1 bière</div>
                <div style={{ fontFamily: T.mono, fontSize: 9, color: 'rgba(254,248,232,0.7)', marginTop: 2, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                  Demi · {(0.25 * rate).toFixed(2)} €
                </div>
              </div>
            </div>
          </button>
          <button
            onClick={() => { setShowSheet(true); setSelectedSize('demi'); }}
            style={{
              width: 68, height: 68, borderRadius: 20, background: T.cardWarm,
              border: `1.5px solid ${T.hairline}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke={T.ink} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.muted }}>TAILLE</span>
          </button>
        </div>
      </div>

      {/* Add beer sheet */}
      {showSheet && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div onClick={() => setShowSheet(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,6,0.5)', animation: 'scrimIn 0.2s ease' }} />
          <div style={{
            position: 'relative', background: T.bg, borderRadius: '28px 28px 0 0',
            padding: `16px 24px calc(env(safe-area-inset-bottom,0px) + 36px)`,
            boxShadow: '0 -20px 40px rgba(0,0,0,0.2)',
            animation: 'sheetIn 0.3s cubic-bezier(0.32,0.72,0,1)',
          }}>
            <div style={{ width: 40, height: 4, background: T.hairline, borderRadius: 2, margin: '0 auto 20px' }} />
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.muted, textTransform: 'uppercase' }}>
              Ajouter une bière
            </div>
            <div style={{ fontFamily: T.display, fontSize: 28, marginTop: 6, lineHeight: 1.0 }}>Quelle taille ?</div>

            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SIZES.map((sz) => (
                <button key={sz.id} onClick={() => setSelectedSize(sz.id)} style={{
                  background: selectedSize === sz.id ? T.ink : T.card,
                  color: selectedSize === sz.id ? T.foam : T.ink,
                  borderRadius: 18, padding: '14px 20px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  boxShadow: selectedSize === sz.id ? `0 4px 0 ${T.ink2}` : `inset 0 0 0 1px ${T.hairline}`,
                  border: 'none', cursor: 'pointer', width: '100%', touchAction: 'manipulation',
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: selectedSize === sz.id ? T.primary : T.bgDeep,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <PintMark size={22} color={T.foam} />
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontFamily: T.display, fontSize: 20 }}>{sz.label}</div>
                    <div style={{ fontFamily: T.mono, fontSize: 11, color: selectedSize === sz.id ? 'rgba(254,248,232,0.6)' : T.muted }}>{sz.unit}</div>
                  </div>
                  <span style={{ fontFamily: T.mono, fontSize: 13, color: selectedSize === sz.id ? T.accent : T.ink2 }}>
                    {(sz.vol * rate).toFixed(2)} €
                  </span>
                </button>
              ))}
            </div>

            {session.participants.length > 1 && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, color: T.muted, textTransform: 'uppercase', marginBottom: 10 }}>Pour qui ?</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {session.participants.map((p) => (
                    <button key={p.id} onClick={() => setSelectedFor(p.id)} style={{
                      height: 36, borderRadius: 18, padding: '0 14px',
                      background: selectedFor === p.id ? T.ink : T.cardWarm,
                      color: selectedFor === p.id ? T.foam : T.ink,
                      border: `1px solid ${selectedFor === p.id ? 'transparent' : T.hairline}`,
                      fontFamily: T.sans, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <span style={{ width: 20, height: 20, borderRadius: 10, background: selectedFor === p.id ? T.primary : T.bgDeep, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontFamily: T.display, color: selectedFor === p.id ? T.foam : T.ink2 }}>{p.name[0]}</span>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Btn primary onClick={handleAddFromSheet} style={{ marginTop: 22 }}>
              Compter la bière
            </Btn>
          </div>
        </div>
      )}

      {/* Manage participants sheet */}
      {showManage && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div onClick={() => setShowManage(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,6,0.5)', animation: 'scrimIn 0.2s ease' }} />
          <div style={{
            position: 'relative', background: T.bg, borderRadius: '28px 28px 0 0',
            padding: `16px 24px calc(env(safe-area-inset-bottom,0px) + 36px)`,
            boxShadow: '0 -20px 40px rgba(0,0,0,0.2)',
            animation: 'sheetIn 0.3s cubic-bezier(0.32,0.72,0,1)',
          }}>
            <div style={{ width: 40, height: 4, background: T.hairline, borderRadius: 2, margin: '0 auto 20px' }} />
            <div style={{ fontFamily: T.display, fontSize: 28, marginBottom: 18 }}>Participants</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {session.participants.map((p) => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: T.cardWarm, borderRadius: 14, padding: '12px 16px',
                  boxShadow: `inset 0 0 0 1px ${T.hairline}`,
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 18, background: T.bgDeep, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.display, fontSize: 16, color: T.ink2 }}>
                    {p.name[0]}
                  </div>
                  <div style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>
                    {p.name}
                    {p.id === session.hostId && <span style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, marginLeft: 8, letterSpacing: 0.8 }}>HÔTE</span>}
                  </div>
                  {p.id !== session.hostId && (
                    <button onClick={() => setConfirmRemove(p)} style={{
                      width: 32, height: 32, borderRadius: 16, background: '#fde8e4',
                      border: `1px solid ${T.primary}40`, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10" stroke={T.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confirm remove participant */}
      {confirmRemove && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 250, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div onClick={() => setConfirmRemove(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,6,0.5)' }} />
          <div style={{
            position: 'relative', background: T.bg, borderRadius: '28px 28px 0 0',
            padding: `24px 24px calc(env(safe-area-inset-bottom,0px) + 36px)`,
            boxShadow: '0 -20px 40px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontFamily: T.display, fontSize: 28, marginBottom: 10 }}>Retirer {confirmRemove.name} ?</div>
            <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.5, marginBottom: 24 }}>
              Toutes les bières comptées pour {confirmRemove.name} seront supprimées. Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={() => {
                removeParticipant(id, confirmRemove.id);
                if (selectedFor === confirmRemove.id) setSelectedFor(user?.id || session.participants[0]?.id);
                setConfirmRemove(null);
                setShowManage(false);
                reload();
              }} style={{
                height: 52, borderRadius: 16, background: T.primary, color: T.foam,
                border: 'none', cursor: 'pointer', fontFamily: T.sans, fontSize: 16, fontWeight: 600,
              }}>
                Oui, retirer
              </button>
              <button onClick={() => setConfirmRemove(null)} style={{
                height: 52, borderRadius: 16, background: T.card, color: T.ink,
                border: `1px solid ${T.hairline}`, cursor: 'pointer', fontFamily: T.sans, fontSize: 16, fontWeight: 500,
              }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finish confirm */}
      {showFinishConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div onClick={() => setShowFinishConfirm(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,6,0.5)' }} />
          <div style={{
            position: 'relative', background: T.bg, borderRadius: '28px 28px 0 0',
            padding: `24px 24px calc(env(safe-area-inset-bottom,0px) + 36px)`,
            boxShadow: '0 -20px 40px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontFamily: T.display, fontSize: 32, lineHeight: 1.0, marginBottom: 10 }}>Fermer le fût ?</div>
            <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.5, marginBottom: 24 }}>
              Le split sera calculé sur la base des {session.drinks.length} bières comptées. Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Btn primary onClick={handleFinish}>Oui, fermer le fût</Btn>
              <Btn onClick={() => setShowFinishConfirm(false)}>Annuler</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
