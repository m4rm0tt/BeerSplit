import { useParams, useNavigate } from 'react-router-dom';
import { T } from '../theme';
import { useApp } from '../context/AppContext';
import { getSession } from '../utils/storage';
import Badge from '../components/Badge';

function computeLeaderboard(session) {
  const rate = session.volume > 0 ? session.price / session.volume : 0;
  const map = {};
  session.participants.forEach((p) => { map[p.id] = { ...p, vol: 0, beers: 0, owed: 0, lastTs: 0 }; });
  session.drinks.forEach((d) => {
    if (map[d.participantId]) {
      map[d.participantId].vol += d.vol;
      map[d.participantId].beers++;
      if (d.ts > map[d.participantId].lastTs) map[d.participantId].lastTs = d.ts;
    }
  });
  Object.values(map).forEach((p) => { p.owed = p.vol * rate; });
  return Object.values(map).sort((a, b) => b.vol - a.vol);
}

function fmtTime(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function Leaderboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();
  const session = getSession(id);

  if (!session) { navigate('/'); return null; }

  const lb = computeLeaderboard(session);
  const maxVol = lb[0]?.vol || 1;
  const top3 = [lb[1], lb[0], lb[2]].filter(Boolean);
  const podiumHeights = [110, 150, 90];

  return (
    <div className="screen">
      <div className="grain" />
      <div style={{ position: 'relative', minHeight: '100dvh', paddingBottom: 40 }}>
        {/* Nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'calc(env(safe-area-inset-top,0px) + 10px) 20px 10px' }}>
          <button onClick={() => navigate(-1)} style={{ fontSize: 16, color: T.primary, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.sans }}>
            ← Session
          </button>
          <Badge tone="ember">{session.code}</Badge>
          <div style={{ width: 56 }} />
        </div>

        <div style={{ padding: '14px 24px 20px' }}>
          <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, color: T.muted, textTransform: 'uppercase' }}>Classement live</div>
          <div style={{ fontFamily: T.display, fontSize: 38, lineHeight: 1.0, letterSpacing: -0.8, marginTop: 8 }}>Le podium provisoire.</div>
        </div>

        {/* Podium */}
        {lb.length >= 2 && (
          <div style={{ padding: '0 24px 24px', display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            {[
              { data: lb[1], h: podiumHeights[0], bg: T.card },
              { data: lb[0], h: podiumHeights[1], bg: T.ink, fg: T.foam, crown: true },
              { data: lb[2] || null, h: podiumHeights[2], bg: T.card },
            ].map((item, i) => (
              item.data ? (
                <div key={item.data.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 50, height: 50, borderRadius: 25, background: T.bgDeep, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.display, fontSize: 20, color: T.ink2, position: 'relative' }}>
                    {item.data.name[0]}
                    {item.crown && <span style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%) rotate(-8deg)', fontFamily: T.display, fontSize: 16, color: T.primary }}>★</span>}
                  </div>
                  <div style={{
                    width: '100%', height: item.h, background: item.bg, color: item.fg || T.ink,
                    borderRadius: '14px 14px 0 0',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 4px',
                    boxShadow: !item.fg ? `inset 0 0 0 1px ${T.hairline}` : 'none',
                  }}>
                    <div style={{ fontFamily: T.display, fontSize: 28, lineHeight: 1 }}>{item.data.beers}</div>
                    <div style={{ fontFamily: T.mono, fontSize: 9, opacity: 0.7, marginTop: 2 }}>BIÈRES</div>
                    <div style={{ fontFamily: T.display, fontSize: 13, marginTop: 10, opacity: 0.85, textAlign: 'center', padding: '0 4px' }}>{item.data.name}</div>
                    <div style={{ fontFamily: T.display, fontSize: 28, color: item.fg ? T.accent : T.primary, marginTop: 2, lineHeight: 1 }}>{i === 1 ? 1 : i === 0 ? 2 : 3}</div>
                  </div>
                </div>
              ) : <div key={i} style={{ flex: 1 }} />
            ))}
          </div>
        )}

        {/* Full list */}
        <div style={{ padding: '0 24px 8px' }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, color: T.muted, textTransform: 'uppercase' }}>
            {session.participants.length} participants
          </span>
        </div>
        <div style={{ padding: '0 16px' }}>
          {lb.map((p, i) => (
            <div key={p.id} style={{
              padding: '14px 14px', display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: `1px solid ${T.hairline}`,
              background: p.id === user?.id ? `${T.primary}0a` : 'transparent',
              borderRadius: p.id === user?.id ? 10 : 0,
              marginBottom: 2,
            }}>
              <span style={{ fontFamily: T.display, fontSize: 18, color: T.muted, width: 22 }}>{i + 1}</span>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: p.id === user?.id ? T.ink : T.bgDeep, color: p.id === user?.id ? T.foam : T.ink2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.display, fontSize: 16 }}>
                {p.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>
                  {p.name}{p.id === user?.id && <span style={{ color: T.muted, fontWeight: 400, fontSize: 13 }}> · toi</span>}
                </div>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, marginTop: 2 }}>
                  dernier verre · {fmtTime(p.lastTs)}
                </div>
              </div>
              <div style={{ width: 80 }}>
                <div style={{ height: 6, borderRadius: 3, background: T.hairline, position: 'relative', marginBottom: 4 }}>
                  <div style={{ position: 'absolute', inset: 0, width: `${(p.vol / maxVol) * 100}%`, background: T.primary, borderRadius: 3 }} />
                </div>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink2, textAlign: 'right' }}>
                  {p.beers} · {p.owed.toFixed(2)} €
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
