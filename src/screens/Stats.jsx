import { T } from '../theme';
import { useApp } from '../context/AppContext';
import { computeStats } from '../utils/storage';
import PintMark from '../components/PintMark';
import TabBar from '../components/TabBar';

const MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D'];

export default function Stats() {
  const { user } = useApp();
  const stats = user ? computeStats(user.id) : {};
  const maxMonth = Math.max(...(stats.monthCounts || [1]), 1);

  return (
    <div className="screen" style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}>
      <div className="grain" />
      <div style={{ position: 'relative', padding: 'calc(env(safe-area-inset-top,0px) + 12px) 24px 18px' }}>
        <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.6, color: T.muted, textTransform: 'uppercase' }}>
          Stats — {user?.name} · {new Date().getFullYear()}
        </div>
        <div style={{ fontFamily: T.display, fontSize: 38, lineHeight: 1.0, letterSpacing: -0.8, marginTop: 8 }}>
          Ton année au comptoir.
        </div>
      </div>

      {/* Hero card */}
      <div style={{ position: 'relative', padding: '0 16px 16px' }}>
        <div style={{ background: T.ink, color: T.foam, borderRadius: 24, padding: '24px 22px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`, backgroundSize: '12px 12px' }} />
          <span style={{ fontFamily: T.mono, fontSize: 10, color: 'rgba(254,248,232,0.6)', letterSpacing: 1.4 }}>BIÈRES BUES CETTE ANNÉE</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8, position: 'relative' }}>
            <span style={{ fontFamily: T.display, fontSize: 80, lineHeight: 0.9, letterSpacing: -2 }}>
              {stats.totalBeers || 0}
            </span>
          </div>
          {/* Sparkline */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, marginTop: 20, height: 50, position: 'relative' }}>
            {(stats.monthCounts || Array(12).fill(0)).map((v, i) => (
              <div key={i} style={{
                flex: 1,
                height: `${Math.max(8, (v / maxMonth) * 100)}%`,
                background: v === maxMonth && v > 0 ? T.accent : 'rgba(254,248,232,0.22)',
                borderRadius: '2px 2px 0 0',
                transition: 'height 0.5s ease',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: T.mono, fontSize: 9, color: 'rgba(254,248,232,0.5)' }}>
            {MONTHS.map((m) => <span key={m}>{m}</span>)}
          </div>
        </div>
      </div>

      {/* Metric tiles */}
      <div style={{ position: 'relative', padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { label: 'Moy. / semaine', val: stats.avgPerWeek || 0, sub: 'bières' },
          { label: 'Total dépensé', val: stats.totalPaid ? `${stats.totalPaid.toFixed(0)}` : '0', sub: '€ cette année' },
          { label: 'Fûts terminés', val: stats.kegsFinished || 0, sub: 'avec les copains' },
          { label: 'Meilleur jour', val: stats.bestDay || '—', sub: 'de la semaine' },
        ].map((m) => (
          <div key={m.label} style={{
            background: T.card, borderRadius: 16, padding: '16px',
            boxShadow: `inset 0 0 0 1px ${T.hairline}`,
          }}>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, letterSpacing: 1.2, textTransform: 'uppercase' }}>{m.label}</div>
            <div style={{ fontFamily: T.display, fontSize: 34, marginTop: 6, lineHeight: 1, letterSpacing: -0.6 }}>{m.val}</div>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, marginTop: 2 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Fav beer */}
      {stats.favBeer && (
        <div style={{ position: 'relative', padding: '16px 16px 0' }}>
          <div style={{ background: T.cardWarm, borderRadius: 16, padding: '16px', boxShadow: `inset 0 0 0 1px ${T.hairline}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: T.bgDeep, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <PintMark size={28} color={T.primary} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: T.mono, fontSize: 9, color: T.muted, letterSpacing: 1.2, textTransform: 'uppercase' }}>Bière préférée</div>
              <div style={{ fontFamily: T.display, fontSize: 20, lineHeight: 1, marginTop: 4 }}>{stats.favBeer.split(' — ')[1] || stats.favBeer}</div>
              <div style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, marginTop: 4 }}>{stats.favBeer.split(' — ')[0]}</div>
            </div>
          </div>
        </div>
      )}

      {stats.totalBeers === 0 && (
        <div style={{ position: 'relative', textAlign: 'center', padding: '48px 32px', color: T.muted }}>
          <PintMark size={48} color={T.muted} />
          <p style={{ fontFamily: T.display, fontSize: 22, marginTop: 16, color: T.ink }}>Aucun fût terminé cette année.</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>Tes stats apparaîtront ici après ta première session.</p>
        </div>
      )}

      <TabBar />
    </div>
  );
}
