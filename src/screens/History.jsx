import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../theme';
import { useApp } from '../context/AppContext';
import PintMark from '../components/PintMark';
import Badge from '../components/Badge';
import Btn from '../components/Btn';
import TabBar from '../components/TabBar';

function fmtDate(ts) {
  return new Date(ts).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtDuration(start, end) {
  if (!end) return '';
  const diff = end - start;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m}min`;
}

export default function History() {
  const { sessions, user, deleteSession } = useApp();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(null);

  const sorted = [...sessions].sort((a, b) => b.startDate - a.startDate);
  const finished = sorted.filter((s) => s.status === 'finished');
  const active = sorted.filter((s) => s.status === 'active');

  const userOwed = (session) => {
    const rate = session.volume > 0 ? session.price / session.volume : 0;
    const myVol = session.drinks.filter((d) => d.participantId === user?.id).reduce((a, d) => a + d.vol, 0);
    return (myVol * rate).toFixed(2);
  };

  return (
    <div className="screen" style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}>
      <div className="grain" />
      <div style={{ position: 'relative', padding: 'calc(env(safe-area-inset-top,0px) + 16px) 24px 20px' }}>
        <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, color: T.muted, textTransform: 'uppercase' }}>Historique</div>
        <div style={{ fontFamily: T.display, fontSize: 38, lineHeight: 1.0, letterSpacing: -0.8, marginTop: 8 }}>Tous tes fûts.</div>
      </div>

      {active.length > 0 && (
        <>
          <div style={{ position: 'relative', padding: '0 24px 8px' }}>
            <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, color: T.primary, textTransform: 'uppercase' }}>En cours</span>
          </div>
          <div style={{ position: 'relative', padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {active.map((s) => (
              <div key={s.id} style={{ position: 'relative' }}>
                <div onClick={() => navigate(`/session/${s.id}`)} style={{
                  background: T.ink, color: T.foam, borderRadius: 16, padding: '16px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <PintMark size={22} color={T.foam} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.brewery} — {s.beer}</div>
                    <div style={{ fontFamily: T.mono, fontSize: 11, color: 'rgba(254,248,232,0.6)', marginTop: 3 }}>
                      Code : {s.code} · {s.drinks.length} bières
                    </div>
                  </div>
                  <Badge tone="ember">LIVE</Badge>
                </div>
                {user?.isAdmin && (
                  <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(s); }} style={{
                    position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14,
                    background: 'rgba(168,50,10,0.85)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.foam,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {finished.length > 0 ? (
        <>
          <div style={{ position: 'relative', padding: '0 24px 8px' }}>
            <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, color: T.muted, textTransform: 'uppercase' }}>Terminés ({finished.length})</span>
          </div>
          <div style={{ position: 'relative', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {finished.map((s) => (
              <div key={s.id} style={{ position: 'relative' }}>
                <div onClick={() => navigate(`/split/${s.id}`)} style={{
                  background: T.cardWarm, borderRadius: 16, padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  boxShadow: `inset 0 0 0 1px ${T.hairline}`, cursor: 'pointer',
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: T.bgDeep, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <PintMark size={22} color={T.ink2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.brewery} — {s.beer}
                    </div>
                    <div style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, marginTop: 3 }}>
                      {fmtDate(s.startDate)} · {s.volume} L · {s.drinks.length} bières
                      {s.endDate && ` · ${fmtDuration(s.startDate, s.endDate)}`}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, paddingRight: user?.isAdmin ? 28 : 0 }}>
                    <div style={{ fontFamily: T.display, fontSize: 18, color: T.primary }}>{userOwed(s)} €</div>
                    <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, marginTop: 2 }}>ta part</div>
                  </div>
                </div>
                {user?.isAdmin && (
                  <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(s); }} style={{
                    position: 'absolute', top: '50%', right: 14, transform: 'translateY(-50%)',
                    width: 28, height: 28, borderRadius: 14,
                    background: T.primary, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.foam,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ position: 'relative', textAlign: 'center', padding: '64px 32px', color: T.muted }}>
          <PintMark size={48} color={T.muted} />
          <p style={{ fontFamily: T.display, fontSize: 22, marginTop: 16, color: T.ink }}>Aucun fût terminé.</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>Tes sessions terminées apparaîtront ici.</p>
        </div>
      )}

      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div onClick={() => setConfirmDelete(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,6,0.5)' }} />
          <div style={{
            position: 'relative', background: T.bg, borderRadius: '28px 28px 0 0',
            padding: `24px 24px calc(env(safe-area-inset-bottom,0px) + 36px)`,
            boxShadow: '0 -20px 40px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontFamily: T.display, fontSize: 28, marginBottom: 10 }}>Supprimer ce fût ?</div>
            <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.5, marginBottom: 6 }}>
              <b>{confirmDelete.brewery} — {confirmDelete.beer}</b>
            </p>
            <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.5, marginBottom: 24 }}>
              Cette action est irréversible. Toutes les données de cette session seront supprimées.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Btn danger onClick={() => { deleteSession(confirmDelete.id); setConfirmDelete(null); }}>
                Supprimer définitivement
              </Btn>
              <Btn onClick={() => setConfirmDelete(null)}>Annuler</Btn>
            </div>
          </div>
        </div>
      )}

      <TabBar />
    </div>
  );
}
