import { useParams, useNavigate } from 'react-router-dom';
import { T } from '../theme';
import { useApp } from '../context/AppContext';
import { getSession } from '../utils/storage';
import Badge from '../components/Badge';
import Btn from '../components/Btn';
import PintMark from '../components/PintMark';

function computeSplit(session) {
  const rate = session.volume > 0 ? session.price / session.volume : 0;
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

export default function Split() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();
  const session = getSession(id);

  if (!session) { navigate('/'); return null; }

  const split = computeSplit(session);
  const totalDrunk = session.drinks.reduce((a, d) => a + d.vol, 0);
  const totalCollected = split.reduce((a, p) => a + p.owed, 0);
  const fond = Math.max(0, session.price - totalCollected);
  const durationMs = session.endDate ? session.endDate - session.startDate : 0;
  const durationH = Math.floor(durationMs / 3600000);
  const durationM = Math.floor((durationMs % 3600000) / 60000);
  const durationStr = durationMs > 0 ? `${durationH > 0 ? durationH + 'h' : ''}${durationM}min` : '';

  const handleShare = () => {
    const lines = split.map((p) => `${p.name}: ${p.owed.toFixed(2)} €`).join('\n');
    const text = `🍺 BeerSplit — ${session.brewery} · ${session.beer}\n\n${lines}\n\nTotal collecté: ${totalCollected.toFixed(2)} €`;
    if (navigator.share) navigator.share({ title: 'BeerSplit', text });
    else navigator.clipboard?.writeText(text);
  };

  return (
    <div className="screen">
      <div className="grain" />
      <div style={{ position: 'relative', paddingBottom: 40 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'calc(env(safe-area-inset-top,0px) + 10px) 20px 8px' }}>
          <Badge tone="green">✓ Fût terminé</Badge>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.muted }}>{durationStr}</span>
        </div>

        <div style={{ padding: '8px 24px 18px' }}>
          <div style={{ fontFamily: T.display, fontSize: 42, lineHeight: 1.0, letterSpacing: -0.8 }}>Fond du fût.</div>
          <div style={{ fontSize: 14, color: T.muted, marginTop: 8, maxWidth: 300, lineHeight: 1.4 }}>
            {session.drinks.length} bières · {totalDrunk.toFixed(1)} L bus ·
            répartis au prorata du volume consommé.
          </div>
        </div>

        {/* Total card */}
        <div style={{ padding: '0 16px 18px' }}>
          <div style={{ background: T.ink, color: T.foam, borderRadius: 24, padding: '22px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.08 }}>
              <PintMark size={120} color={T.foam} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              <div>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: 'rgba(254,248,232,0.6)', letterSpacing: 1.4, textTransform: 'uppercase' }}>Prix du fût</div>
                <div style={{ fontFamily: T.display, fontSize: 38, marginTop: 4, lineHeight: 1 }}>{session.price.toFixed(2)} €</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: 'rgba(254,248,232,0.6)', letterSpacing: 1.4, textTransform: 'uppercase' }}>Collecté</div>
                <div style={{ fontFamily: T.display, fontSize: 24, marginTop: 4, color: T.accent }}>{totalCollected.toFixed(2)} €</div>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: 'rgba(254,248,232,0.5)', marginTop: 2 }}>
                  fond reste : {fond.toFixed(2)} €
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ padding: '0 24px 8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, color: T.muted, textTransform: 'uppercase' }}>Qui doit quoi</span>
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.muted }}>
            {session.volume > 0 ? (session.price / session.volume * 0.25).toFixed(2) : '?'} €/bière · 25 cl
          </span>
        </div>

        <div style={{ padding: '4px 16px' }}>
          {split.map((p) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 12px',
              borderRadius: p.id === user?.id ? 12 : 0,
              background: p.id === user?.id ? T.cardWarm : 'transparent',
              borderBottom: p.id === user?.id ? 'none' : `1px solid ${T.hairline}`,
              boxShadow: p.id === user?.id ? `inset 0 0 0 1.5px ${T.ink}` : 'none',
              margin: p.id === user?.id ? '4px 0' : 0,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: p.id === user?.id ? T.ink : T.bgDeep, color: p.id === user?.id ? T.foam : T.ink2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.display, fontSize: 16 }}>
                {p.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>
                  {p.name}{p.id === user?.id && ' (toi)'}
                </div>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, marginTop: 2 }}>
                  {p.beers} bières · {totalDrunk > 0 ? ((p.vol / totalDrunk) * 100).toFixed(0) : 0}%
                </div>
              </div>
              <div style={{ fontFamily: T.display, fontSize: 24, color: T.primary }}>
                {p.owed.toFixed(2)} €
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Btn primary onClick={handleShare}>
            Partager le décompte
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Btn>
          <Btn onClick={() => navigate('/')}>Retour à l'accueil</Btn>
        </div>
      </div>
    </div>
  );
}
