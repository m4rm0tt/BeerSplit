// Direction A — "Comptoir" — Pub chaleureux
// Palette: cream + ambre brûlé + brun foncé
// Fonts: DM Serif Display (display) + Geist (body) + Geist Mono (data)

const A = {
  bg:        '#efe2c4',       // cream paper
  bgDeep:    '#e6d4a8',       // deeper amber paper
  card:      '#fbf4e0',       // light cream card
  cardWarm:  '#fef8ea',       // very light cream
  ink:       '#1a0f06',       // deep brown
  ink2:      '#3d2914',       // warm dark brown
  muted:     '#7a5a3a',       // warm gray-brown
  hairline:  'rgba(60,30,10,0.10)',
  primary:   '#a8320a',       // deep ember
  primaryDk: '#7a1f00',
  accent:    '#d97a1f',       // amber orange
  foam:      '#fef8e8',       // foam highlight
  green:     '#3d6b1f',       // settled green
  display:   "'DM Serif Display', Georgia, serif",
  sans:      "'Geist', -apple-system, system-ui, sans-serif",
  mono:      "'Geist Mono', ui-monospace, monospace",
};

// shared status-bar offset (the IOSDevice status bar is absolutely positioned)
const STATUS_PAD = 58;

// ─── tiny utilities ────────────────────────────────────────
function ABadge({ children, tone='amber', style={} }) {
  const tones = {
    amber: { bg: '#fce6b8', fg: A.ink },
    ink:   { bg: A.ink, fg: '#fef8e8' },
    ember: { bg: A.primary, fg: '#fef8e8' },
    foam:  { bg: '#fff', fg: A.ink2 },
    green: { bg: '#dde8c4', fg: A.green },
  }[tone];
  return <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: tones.bg, color: tones.fg,
    fontFamily: A.mono, fontSize: 10, fontWeight: 500,
    textTransform: 'uppercase', letterSpacing: 0.8,
    padding: '4px 8px', borderRadius: 4, ...style,
  }}>{children}</span>;
}

function AButton({ children, primary, style={}, onClick }) {
  return <button onClick={onClick} style={{
    width: '100%', height: 56, border: 'none', borderRadius: 14,
    background: primary ? A.ink : A.cardWarm,
    color: primary ? A.foam : A.ink,
    fontFamily: A.sans, fontSize: 17, fontWeight: 600, letterSpacing: -0.2,
    boxShadow: primary ? '0 4px 0 ' + A.primaryDk : 'inset 0 0 0 1px ' + A.hairline,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    ...style,
  }}>{children}</button>;
}

// SVG: a tiny stamped pint-glass mark used as logo
function APintMark({ size=28, color=A.primary }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M8 5h16l-2 22a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3L8 5z"
        stroke={color} strokeWidth="2" strokeLinejoin="round"/>
      <path d="M9.5 12h13" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <circle cx="13" cy="9" r="0.9" fill={color}/>
      <circle cx="16" cy="8.2" r="0.9" fill={color}/>
      <circle cx="19" cy="9" r="0.9" fill={color}/>
    </svg>
  );
}

// ───────────────────────────────────────────────────────────
// Screen 1 — Login
// ───────────────────────────────────────────────────────────
function A1_Login() {
  return (
    <IOSDevice width={402} height={874}>
      <div style={{
        height: '100%', background: A.bg, padding: STATUS_PAD + 'px 28px 40px',
        display: 'flex', flexDirection: 'column', position: 'relative',
        fontFamily: A.sans, color: A.ink,
      }}>
        {/* subtle paper grain */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(' + A.hairline + ' 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}/>

        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* brand mark */}
          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <APintMark size={44}/>
            <div>
              <div style={{ fontFamily: A.display, fontSize: 56, lineHeight: 0.95, letterSpacing: -1, color: A.ink }}>
                BeerSplit
              </div>
              <div style={{ fontFamily: A.mono, fontSize: 11, letterSpacing: 1.6, marginTop: 10, color: A.muted, textTransform: 'uppercase' }}>
                Le fût, partagé honnêtement
              </div>
            </div>
          </div>

          {/* inputs */}
          <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'EMAIL', value: 'pierre@maison.fr' },
              { label: 'MOT DE PASSE', value: '••••••••••', pwd: true },
            ].map((f, i) => (
              <div key={i} style={{
                background: A.card, borderRadius: 14, padding: '14px 18px',
                boxShadow: 'inset 0 0 0 1px ' + A.hairline,
              }}>
                <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.4, color: A.muted }}>
                  {f.label}
                </div>
                <div style={{ fontSize: 17, fontWeight: 500, marginTop: 4, letterSpacing: f.pwd ? 3 : -0.2 }}>
                  {f.value}
                </div>
              </div>
            ))}
            <div style={{ alignSelf: 'flex-end', marginTop: -4, fontSize: 13, color: A.primary, fontWeight: 500 }}>
              Mot de passe oublié ?
            </div>
          </div>

          <div style={{ flex: 1 }}/>

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AButton primary>
              Se connecter
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </AButton>
            <AButton>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="3" width="12" height="9" rx="1.5" stroke={A.ink} strokeWidth="1.5"/>
                <path d="M3 5l4 3 4-3" stroke={A.ink} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Continuer avec Apple
            </AButton>
            <div style={{ textAlign: 'center', marginTop: 8, fontSize: 14, color: A.muted }}>
              Pas de compte ? <span style={{ color: A.ink, fontWeight: 600, borderBottom: '1px solid ' + A.ink }}>Créer un compte</span>
            </div>
          </div>
        </div>
      </div>
    </IOSDevice>
  );
}

// ───────────────────────────────────────────────────────────
// Screen 2 — Home (no active session) — Create or Join
// ───────────────────────────────────────────────────────────
function A2_Home() {
  return (
    <IOSDevice width={402} height={874}>
      <div style={{
        height: '100%', background: A.bg, padding: STATUS_PAD + 'px 0 100px',
        fontFamily: A.sans, color: A.ink, overflow: 'auto',
      }}>
        {/* header */}
        <div style={{ padding: '8px 24px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <APintMark size={24}/>
            <span style={{ fontFamily: A.display, fontSize: 24, color: A.ink }}>BeerSplit</span>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: 18, background: A.ink, color: A.foam,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: A.display, fontSize: 16,
          }}>P</div>
        </div>

        {/* salutation */}
        <div style={{ padding: '8px 24px 28px' }}>
          <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.6, color: A.muted, textTransform: 'uppercase' }}>
            Bonsoir, Pierre — Sam. 21h47
          </div>
          <div style={{ fontFamily: A.display, fontSize: 38, lineHeight: 1.02, marginTop: 10, color: A.ink, letterSpacing: -0.8 }}>
            Aucun fût en perce.
          </div>
          <div style={{ fontSize: 15, color: A.muted, marginTop: 8, maxWidth: 280, lineHeight: 1.4 }}>
            Mets-en un en route, ou rejoins celui d'un copain.
          </div>
        </div>

        {/* two big actions */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Create */}
          <div style={{
            background: A.ink, color: A.foam, borderRadius: 24,
            padding: '22px 22px 24px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', right: -20, top: -10, opacity: 0.18 }}>
              <APintMark size={120} color={A.foam}/>
            </div>
            <ABadge tone="ember">Nouveau fût</ABadge>
            <div style={{ fontFamily: A.display, fontSize: 30, lineHeight: 1.0, marginTop: 14, letterSpacing: -0.4 }}>
              Mettre en perce
            </div>
            <div style={{ fontSize: 13, color: 'rgba(254,248,232,0.65)', marginTop: 6 }}>
              Crée une session, invite tes potes par code
            </div>
            <div style={{
              marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 8,
              background: A.primary, color: A.foam, borderRadius: 12, padding: '10px 16px',
              fontSize: 14, fontWeight: 600,
            }}>
              Commencer
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Join */}
          <div style={{ background: A.card, borderRadius: 24, padding: '22px', boxShadow: 'inset 0 0 0 1px ' + A.hairline }}>
            <ABadge tone="amber">Rejoindre</ABadge>
            <div style={{ fontFamily: A.display, fontSize: 26, marginTop: 12, letterSpacing: -0.3 }}>
              Code de session
            </div>
            <div style={{
              marginTop: 16, display: 'flex', gap: 8,
            }}>
              {['F','U','T','—','7','3'].map((c, i) => (
                <div key={i} style={{
                  flex: 1, height: 56, borderRadius: 12,
                  background: c==='—' ? 'transparent' : A.cardWarm,
                  border: c==='—' ? 'none' : '1.5px solid ' + (i<3 ? A.ink : A.hairline),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: A.display, fontSize: 26, color: c==='—' ? A.muted : A.ink,
                }}>{c}</div>
              ))}
            </div>
            <div style={{ marginTop: 12, fontFamily: A.mono, fontSize: 11, color: A.muted, letterSpacing: 0.8 }}>
              6 caractères — demande-le à l'hôte
            </div>
          </div>
        </div>

        {/* historique */}
        <div style={{ padding: '32px 24px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: A.mono, fontSize: 11, letterSpacing: 1.6, color: A.muted, textTransform: 'uppercase' }}>
              Fûts récents
            </span>
            <span style={{ fontSize: 13, color: A.primary, fontWeight: 500 }}>Tout voir</span>
          </div>
        </div>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { name: 'Brasserie du Mont — Triple', date: '03 mai · 30 L', count: '47 bières', dette: '–14€' },
            { name: 'Heineken — Blonde', date: '12 avr. · 20 L', count: '38 bières', dette: '+8€' },
          ].map((f, i) => (
            <div key={i} style={{
              background: A.cardWarm, borderRadius: 16, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: 'inset 0 0 0 1px ' + A.hairline,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: A.bgDeep,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <APintMark size={22} color={A.ink2}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: A.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.name}
                </div>
                <div style={{ fontFamily: A.mono, fontSize: 11, color: A.muted, marginTop: 3 }}>
                  {f.date} · {f.count}
                </div>
              </div>
              <div style={{
                fontFamily: A.display, fontSize: 18,
                color: f.dette.startsWith('+') ? A.green : A.primary,
              }}>{f.dette}</div>
            </div>
          ))}
        </div>
      </div>

      {/* bottom tab bar */}
      <ATabBar active="home"/>
    </IOSDevice>
  );
}

function ATabBar({ active }) {
  const items = [
    { k: 'home', label: 'Accueil' },
    { k: 'stats', label: 'Stats' },
    { k: 'history', label: 'Historique' },
    { k: 'profile', label: 'Profil' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 84,
      background: 'rgba(239,226,196,0.92)', backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderTop: '1px solid ' + A.hairline,
      display: 'flex', padding: '10px 12px 28px', gap: 4,
      fontFamily: A.sans,
    }}>
      {items.map(it => (
        <div key={it.k} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          color: active===it.k ? A.ink : A.muted,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: active===it.k ? A.ink : 'transparent',
            border: active===it.k ? 'none' : '1.5px solid ' + A.muted,
          }}/>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.2 }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Screen 3 — Create session — keg config
// ───────────────────────────────────────────────────────────
function A3_CreateSession() {
  return (
    <IOSDevice width={402} height={874}>
      <div style={{
        height: '100%', background: A.bg, padding: STATUS_PAD + 'px 0 40px',
        fontFamily: A.sans, color: A.ink, overflow: 'auto',
      }}>
        {/* nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 8px' }}>
          <span style={{ fontSize: 16, color: A.primary, fontWeight: 500 }}>Annuler</span>
          <ABadge tone="amber">Étape 1 / 2</ABadge>
          <span style={{ width: 56 }}/>
        </div>

        <div style={{ padding: '16px 24px 22px' }}>
          <div style={{ fontFamily: A.display, fontSize: 40, lineHeight: 1.0, letterSpacing: -0.8 }}>
            Le fût en perce.
          </div>
          <div style={{ fontSize: 15, color: A.muted, marginTop: 8 }}>
            Renseigne-le, on calculera le prorata au goutte-près.
          </div>
        </div>

        {/* Bière */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: A.card, borderRadius: 20, padding: 20, boxShadow: 'inset 0 0 0 1px ' + A.hairline }}>
            <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.4, color: A.muted, textTransform: 'uppercase' }}>
              Brasserie
            </div>
            <div style={{ fontSize: 19, fontWeight: 600, marginTop: 6 }}>Brasserie du Mont</div>
            <div style={{ height: 1, background: A.hairline, margin: '14px 0' }}/>
            <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.4, color: A.muted, textTransform: 'uppercase' }}>
              Bière
            </div>
            <div style={{ fontSize: 19, fontWeight: 600, marginTop: 6 }}>Triple ambrée · 7,2°</div>
          </div>

          {/* Volume — segmented */}
          <div style={{ background: A.card, borderRadius: 20, padding: 20, boxShadow: 'inset 0 0 0 1px ' + A.hairline }}>
            <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.4, color: A.muted, textTransform: 'uppercase' }}>
              Volume du fût
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              {['5 L', '20 L', '30 L', '50 L'].map((v, i) => (
                <div key={v} style={{
                  flex: 1, height: 56, borderRadius: 14,
                  background: i===2 ? A.ink : A.cardWarm,
                  color: i===2 ? A.foam : A.ink,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: A.display, fontSize: 18,
                  boxShadow: i===2 ? 'none' : 'inset 0 0 0 1px ' + A.hairline,
                }}>{v}</div>
              ))}
            </div>
          </div>

          {/* Prix */}
          <div style={{ background: A.card, borderRadius: 20, padding: 20, boxShadow: 'inset 0 0 0 1px ' + A.hairline }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.4, color: A.muted, textTransform: 'uppercase' }}>
                Prix du fût
              </div>
              <div style={{ fontFamily: A.mono, fontSize: 11, color: A.muted }}>
                ≈ 2,80 €/bière (25cl)
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 10, gap: 8 }}>
              <span style={{ fontFamily: A.display, fontSize: 56, lineHeight: 0.95, letterSpacing: -1.5 }}>168</span>
              <span style={{ fontFamily: A.display, fontSize: 28, color: A.muted }}>,00 €</span>
            </div>
          </div>

          {/* Date */}
          <div style={{ background: A.card, borderRadius: 20, padding: '18px 20px', boxShadow: 'inset 0 0 0 1px ' + A.hairline, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.4, color: A.muted, textTransform: 'uppercase' }}>
                Mise en perce
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, marginTop: 4 }}>
                Aujourd'hui · 21:50
              </div>
            </div>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="16" rx="2" stroke={A.ink2} strokeWidth="1.6"/>
              <path d="M3 9h18M8 3v4M16 3v4" stroke={A.ink2} strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <div style={{ padding: '24px 16px 0' }}>
          <AButton primary>
            Suivant — Inviter les copains
          </AButton>
        </div>
      </div>
    </IOSDevice>
  );
}

// ───────────────────────────────────────────────────────────
// Screen 4 — Session active — main counter
// ───────────────────────────────────────────────────────────
function A4_Session() {
  // litres bus
  const buvuPct = 0.62;
  return (
    <IOSDevice width={402} height={874}>
      <div style={{
        height: '100%', background: A.bg, padding: STATUS_PAD + 'px 0 0',
        fontFamily: A.sans, color: A.ink, overflow: 'auto', position: 'relative',
      }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: A.primary, boxShadow: '0 0 0 4px ' + A.primary+'33' }}/>
            <ABadge tone="ember">EN COURS · FUT-73</ABadge>
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: 17, background: A.cardWarm,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 0 0 1px ' + A.hairline,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="1.6" fill={A.ink}/>
              <circle cx="6" cy="12" r="1.6" fill={A.ink}/>
              <circle cx="18" cy="12" r="1.6" fill={A.ink}/>
            </svg>
          </div>
        </div>

        {/* keg headline */}
        <div style={{ padding: '0 24px 18px' }}>
          <div style={{ fontFamily: A.display, fontSize: 30, lineHeight: 1.0, letterSpacing: -0.5 }}>
            Triple ambrée
          </div>
          <div style={{ fontSize: 13, color: A.muted, marginTop: 4 }}>
            Brasserie du Mont · 30 L · 168 €
          </div>
        </div>

        {/* keg level visualisation */}
        <div style={{ padding: '0 16px 22px' }}>
          <div style={{
            background: A.ink, borderRadius: 24, padding: '24px 22px 22px',
            color: A.foam, position: 'relative', overflow: 'hidden',
          }}>
            {/* paper grain */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none',
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '12px 12px',
            }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', position: 'relative' }}>
              <span style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.6, color: 'rgba(254,248,232,0.6)' }}>
                NIVEAU DU FÛT
              </span>
              <span style={{ fontFamily: A.mono, fontSize: 11, color: A.accent }}>
                {Math.round((1-buvuPct)*30)},2 L restants
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 12, position: 'relative' }}>
              <span style={{ fontFamily: A.display, fontSize: 72, lineHeight: 0.9, letterSpacing: -2 }}>
                {Math.round(buvuPct*100)}
              </span>
              <span style={{ fontFamily: A.display, fontSize: 28, color: 'rgba(254,248,232,0.55)' }}>%</span>
              <span style={{ marginLeft: 'auto', fontFamily: A.mono, fontSize: 11, color: 'rgba(254,248,232,0.5)', textTransform: 'uppercase' }}>
                bu
              </span>
            </div>
            {/* progress bar */}
            <div style={{
              marginTop: 16, height: 10, borderRadius: 5,
              background: 'rgba(254,248,232,0.12)', overflow: 'hidden', position: 'relative',
            }}>
              <div style={{
                position: 'absolute', inset: 0, width: (buvuPct*100)+'%',
                background: 'linear-gradient(90deg, ' + A.accent + ', ' + A.primary + ')',
                borderRadius: 5,
              }}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, position: 'relative' }}>
              <span style={{ fontFamily: A.mono, fontSize: 10, color: 'rgba(254,248,232,0.5)' }}>74 bières</span>
              <span style={{ fontFamily: A.mono, fontSize: 10, color: 'rgba(254,248,232,0.5)' }}>~46 restantes</span>
            </div>
          </div>
        </div>

        {/* leaderboard mini */}
        <div style={{ padding: '0 24px 8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: A.mono, fontSize: 11, letterSpacing: 1.6, color: A.muted, textTransform: 'uppercase' }}>
            Le classement
          </span>
          <span style={{ fontSize: 13, color: A.primary, fontWeight: 500 }}>Tout voir →</span>
        </div>
        <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { rank: 1, name: 'Pierre (toi)', count: 14, dette: 39.20, you: true },
            { rank: 2, name: 'Marco', count: 12, dette: 33.60 },
            { rank: 3, name: 'Léa', count: 9, dette: 25.20 },
          ].map(p => (
            <div key={p.rank} style={{
              background: p.you ? A.cardWarm : 'transparent',
              borderRadius: 14, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: p.you ? 'inset 0 0 0 1.5px ' + A.ink : 'none',
            }}>
              <span style={{ fontFamily: A.display, fontSize: 22, color: A.muted, width: 22 }}>{p.rank}</span>
              <div style={{
                width: 34, height: 34, borderRadius: 17, background: A.bgDeep,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: A.display, fontSize: 14, color: A.ink2,
              }}>{p.name[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontFamily: A.mono, fontSize: 10, color: A.muted }}>{p.count} bières · {p.dette.toFixed(2)} €</div>
              </div>
              {/* bar */}
              <div style={{ width: 50, height: 18, display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                {Array.from({length:7}).map((_,i)=> (
                  <div key={i} style={{ flex:1, height: i < Math.min(p.count, 7) ? '100%' : '30%', background: i < Math.min(p.count, 7) ? A.primary : A.hairline, borderRadius: 1 }}/>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA — big +1 button */}
        <div style={{
          position: 'sticky', bottom: 0, left: 0, right: 0,
          padding: '12px 16px 28px',
          background: 'linear-gradient(0deg, ' + A.bg + ' 70%, transparent)',
        }}>
          <button style={{
            width: '100%', height: 72, border: 'none', borderRadius: 20,
            background: A.primary, color: A.foam,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 22px 0 26px', cursor: 'pointer',
            boxShadow: '0 6px 0 ' + A.primaryDk + ', 0 18px 32px ' + A.primary + '40',
            fontFamily: A.display,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
              <APintMark size={32} color={A.foam}/>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 22, lineHeight: 1 }}>+1 bière</div>
                <div style={{ fontFamily: A.mono, fontSize: 10, color: 'rgba(254,248,232,0.7)', marginTop: 2, letterSpacing: 0.8 }}>
                  TAP POUR COMPTER
                </div>
              </div>
            </div>
            <div style={{
              width: 44, height: 44, borderRadius: 22, background: A.primaryDk,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke={A.foam} strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </IOSDevice>
  );
}

// ───────────────────────────────────────────────────────────
// Screen 5 — Add beer sheet (size picker)
// ───────────────────────────────────────────────────────────
function A5_AddBeer() {
  return (
    <IOSDevice width={402} height={874}>
      <div style={{
        height: '100%', background: A.bg, position: 'relative', overflow: 'hidden',
        fontFamily: A.sans, color: A.ink,
      }}>
        {/* faded screen behind */}
        <div style={{ padding: STATUS_PAD + 'px 24px 0', opacity: 0.35, filter: 'blur(1.5px)' }}>
          <div style={{ height: 28, background: A.cardWarm, borderRadius: 8, width: 160 }}/>
          <div style={{ height: 200, background: A.ink, borderRadius: 24, marginTop: 24 }}/>
        </div>
        {/* scrim */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,6,0.45)' }}/>

        {/* sheet */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          background: A.bg, borderRadius: '28px 28px 0 0',
          padding: '14px 24px 36px',
          boxShadow: '0 -20px 40px rgba(0,0,0,0.2)',
        }}>
          <div style={{ width: 40, height: 4, background: A.hairline, borderRadius: 2, margin: '0 auto 18px' }}/>
          <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.6, color: A.muted, textTransform: 'uppercase' }}>
            Une de plus pour Pierre
          </div>
          <div style={{ fontFamily: A.display, fontSize: 30, marginTop: 8, lineHeight: 1.0 }}>
            Quelle taille ?
          </div>

          {/* size options */}
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { name: 'Demi', vol: '25 cl', price: '2,80 €', sel: true },
              { name: 'Pinte', vol: '50 cl', price: '5,60 €' },
              { name: 'Sérieuse', vol: '1 L', price: '11,20 €' },
            ].map(s => (
              <div key={s.name} style={{
                background: s.sel ? A.ink : A.card,
                color: s.sel ? A.foam : A.ink,
                borderRadius: 18, padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: s.sel ? '0 4px 0 ' + A.ink2 : 'inset 0 0 0 1px ' + A.hairline,
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: s.sel ? A.primary : A.bgDeep,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <APintMark size={22} color={A.foam}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: A.display, fontSize: 20 }}>{s.name}</div>
                  <div style={{ fontFamily: A.mono, fontSize: 11, color: s.sel ? 'rgba(254,248,232,0.6)' : A.muted }}>
                    {s.vol}
                  </div>
                </div>
                <span style={{ fontFamily: A.mono, fontSize: 13, color: s.sel ? A.accent : A.ink2 }}>
                  {s.price}
                </span>
              </div>
            ))}
          </div>

          {/* drinker chip row */}
          <div style={{ marginTop: 22 }}>
            <div style={{ fontFamily: A.mono, fontSize: 10, letterSpacing: 1.6, color: A.muted, textTransform: 'uppercase', marginBottom: 10 }}>
              Pour qui ?
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Pierre','Marco','Léa','Tom','+'].map((n,i) => (
                <div key={n} style={{
                  height: 36, borderRadius: 18, padding: '0 14px',
                  background: i===0 ? A.ink : A.cardWarm,
                  color: i===0 ? A.foam : A.ink,
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 14, fontWeight: 500,
                  boxShadow: i===0 ? 'none' : 'inset 0 0 0 1px ' + A.hairline,
                }}>
                  {n!=='+' && <span style={{
                    width: 20, height: 20, borderRadius: 10,
                    background: i===0 ? A.primary : A.bgDeep,
                    fontSize: 10, color: i===0 ? A.foam : A.ink2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: A.display,
                  }}>{n[0]}</span>}
                  {n}
                </div>
              ))}
            </div>
          </div>

          <AButton primary style={{ marginTop: 22 }}>Compter la bière</AButton>
        </div>
      </div>
    </IOSDevice>
  );
}

// ───────────────────────────────────────────────────────────
// Screen 6 — Leaderboard / Participants
// ───────────────────────────────────────────────────────────
function A6_Leaderboard() {
  const players = [
    { rank: 1, name: 'Pierre', count: 14, dette: 39.20, you: true, last: '21:42' },
    { rank: 2, name: 'Marco', count: 12, dette: 33.60, last: '21:38' },
    { rank: 3, name: 'Léa', count: 9, dette: 25.20, last: '21:20' },
    { rank: 4, name: 'Tom', count: 8, dette: 22.40, last: '21:11' },
    { rank: 5, name: 'Sarah', count: 6, dette: 16.80, last: '20:55' },
    { rank: 6, name: 'Hugo', count: 5, dette: 14.00, last: '20:42' },
    { rank: 7, name: 'Inès', count: 4, dette: 11.20, last: '20:30' },
  ];
  const maxCount = Math.max(...players.map(p=>p.count));
  return (
    <IOSDevice width={402} height={874}>
      <div style={{
        height: '100%', background: A.bg, padding: STATUS_PAD + 'px 0 40px',
        fontFamily: A.sans, color: A.ink, overflow: 'auto',
      }}>
        {/* nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 10px' }}>
          <span style={{ fontSize: 16, color: A.primary, fontWeight: 500 }}>← Session</span>
          <ABadge tone="ember">FUT-73</ABadge>
          <span style={{ width: 56 }}/>
        </div>

        <div style={{ padding: '14px 24px 22px' }}>
          <div style={{ fontFamily: A.mono, fontSize: 11, letterSpacing: 1.6, color: A.muted, textTransform: 'uppercase' }}>
            Classement live
          </div>
          <div style={{ fontFamily: A.display, fontSize: 42, lineHeight: 1.0, letterSpacing: -0.8, marginTop: 8 }}>
            Le podium provisoire.
          </div>
        </div>

        {/* podium */}
        <div style={{ padding: '0 24px 24px', display: 'flex', alignItems: 'flex-end', gap: 10 }}>
          {[
            { rank: 2, name: 'Marco', count: 12, h: 110, bg: A.card },
            { rank: 1, name: 'Pierre', count: 14, h: 150, bg: A.ink, fg: A.foam, crown: true },
            { rank: 3, name: 'Léa', count: 9, h: 88, bg: A.card },
          ].map(p => (
            <div key={p.rank} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 50, height: 50, borderRadius: 25, background: A.bgDeep, marginBottom: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: A.display, fontSize: 20, color: A.ink2, position: 'relative',
              }}>
                {p.name[0]}
                {p.crown && <span style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%) rotate(-8deg)',
                  fontFamily: A.display, fontSize: 16, color: A.primary,
                }}>★</span>}
              </div>
              <div style={{
                width: '100%', height: p.h, background: p.bg, color: p.fg || A.ink,
                borderRadius: '14px 14px 0 0',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '8px 4px',
                boxShadow: !p.fg ? 'inset 0 0 0 1px ' + A.hairline : 'none',
              }}>
                <div style={{ fontFamily: A.display, fontSize: 28, lineHeight: 1 }}>{p.count}</div>
                <div style={{ fontFamily: A.mono, fontSize: 9, opacity: 0.7, marginTop: 2 }}>BIÈRES</div>
                <div style={{ fontFamily: A.display, fontSize: 14, marginTop: 12, opacity: 0.85 }}>{p.name}</div>
                <div style={{ fontFamily: A.display, fontSize: 32, color: p.fg ? A.accent : A.primary, marginTop: 2, lineHeight: 1 }}>
                  {p.rank}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* full list */}
        <div style={{ padding: '0 24px 8px' }}>
          <span style={{ fontFamily: A.mono, fontSize: 11, letterSpacing: 1.6, color: A.muted, textTransform: 'uppercase' }}>
            Les 7 participants
          </span>
        </div>
        <div style={{ padding: '8px 16px 0' }}>
          {players.map(p => (
            <div key={p.rank} style={{
              padding: '14px 14px', display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: '1px solid ' + A.hairline,
            }}>
              <span style={{ fontFamily: A.display, fontSize: 18, color: A.muted, width: 22 }}>{p.rank}</span>
              <div style={{
                width: 36, height: 36, borderRadius: 18, background: p.you ? A.ink : A.bgDeep,
                color: p.you ? A.foam : A.ink2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: A.display, fontSize: 16,
              }}>{p.name[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{p.name}{p.you && <span style={{ color: A.muted, fontWeight: 400, fontSize: 13 }}> · toi</span>}</div>
                <div style={{ fontFamily: A.mono, fontSize: 10, color: A.muted, marginTop: 2 }}>
                  dernier verre · {p.last}
                </div>
              </div>
              <div style={{ width: 70 }}>
                <div style={{ height: 6, borderRadius: 3, background: A.hairline, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, width: (p.count/maxCount*100)+'%', background: A.primary, borderRadius: 3 }}/>
                </div>
                <div style={{ fontFamily: A.mono, fontSize: 10, color: A.ink2, marginTop: 3, textAlign: 'right' }}>
                  {p.count} · {p.dette.toFixed(2)}€
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </IOSDevice>
  );
}

// ───────────────────────────────────────────────────────────
// Screen 7 — Stats perso
// ───────────────────────────────────────────────────────────
function A7_Stats() {
  return (
    <IOSDevice width={402} height={874}>
      <div style={{
        height: '100%', background: A.bg, padding: STATUS_PAD + 'px 0 40px',
        fontFamily: A.sans, color: A.ink, overflow: 'auto',
      }}>
        <div style={{ padding: '12px 24px 18px' }}>
          <div style={{ fontFamily: A.mono, fontSize: 11, letterSpacing: 1.6, color: A.muted, textTransform: 'uppercase' }}>
            Stats — Pierre · 2026
          </div>
          <div style={{ fontFamily: A.display, fontSize: 42, lineHeight: 1.0, letterSpacing: -0.8, marginTop: 8 }}>
            Ton année au comptoir.
          </div>
        </div>

        {/* hero metric */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{
            background: A.ink, color: A.foam, borderRadius: 24, padding: '24px 22px',
            position: 'relative', overflow: 'hidden',
          }}>
            <span style={{ fontFamily: A.mono, fontSize: 10, color: 'rgba(254,248,232,0.6)', letterSpacing: 1.4 }}>
              BIÈRES BUES TOTAL
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
              <span style={{ fontFamily: A.display, fontSize: 84, lineHeight: 0.9, letterSpacing: -2 }}>247</span>
              <span style={{
                fontFamily: A.mono, fontSize: 12, color: A.accent,
                background: 'rgba(217,122,31,0.15)', padding: '4px 8px', borderRadius: 4,
              }}>+18% vs 2025</span>
            </div>
            {/* 12-month sparkline */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginTop: 22, height: 52 }}>
              {[3,5,4,6,8,12,18,22,16,14,9,7].map((v,i) => (
                <div key={i} style={{
                  flex: 1, height: (v/22*100)+'%',
                  background: i===7 ? A.accent : 'rgba(254,248,232,0.25)',
                  borderRadius: '2px 2px 0 0',
                }}/>
              ))}
            </div>
            <div style={{ display:'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: A.mono, fontSize: 9, color: 'rgba(254,248,232,0.5)' }}>
              <span>JAN</span><span>AVR</span><span>JUI</span><span>OCT</span><span>DÉC</span>
            </div>
          </div>
        </div>

        {/* metric tiles */}
        <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Moy. / semaine', val: '4,8', sub: 'bières' },
            { label: 'Total payé', val: '486', sub: '€ cette année' },
            { label: 'Fûts terminés', val: '7', sub: 'avec les copains' },
            { label: 'Meilleur soir', val: 'SAM', sub: '21h–23h' },
          ].map(m => (
            <div key={m.label} style={{
              background: A.card, borderRadius: 16, padding: '16px',
              boxShadow: 'inset 0 0 0 1px ' + A.hairline,
            }}>
              <div style={{ fontFamily: A.mono, fontSize: 9, color: A.muted, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                {m.label}
              </div>
              <div style={{ fontFamily: A.display, fontSize: 36, marginTop: 6, lineHeight: 1, letterSpacing: -0.6 }}>
                {m.val}
              </div>
              <div style={{ fontFamily: A.mono, fontSize: 10, color: A.muted, marginTop: 2 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* fav beer */}
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{
            background: A.cardWarm, borderRadius: 16, padding: '16px',
            boxShadow: 'inset 0 0 0 1px ' + A.hairline,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 12, background: A.bgDeep,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <APintMark size={28} color={A.primary}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: A.mono, fontSize: 9, color: A.muted, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                Bière préférée
              </div>
              <div style={{ fontFamily: A.display, fontSize: 22, lineHeight: 1, marginTop: 4 }}>Triple ambrée</div>
              <div style={{ fontFamily: A.mono, fontSize: 10, color: A.muted, marginTop: 4 }}>Brasserie du Mont — 38% de tes bières</div>
            </div>
          </div>
        </div>
      </div>

      <ATabBar active="stats"/>
    </IOSDevice>
  );
}

// ───────────────────────────────────────────────────────────
// Screen 8 — Keg finished — split breakdown
// ───────────────────────────────────────────────────────────
function A8_Split() {
  const split = [
    { name: 'Pierre', count: 14, owes: 39.20, you: true },
    { name: 'Marco', count: 12, owes: 33.60 },
    { name: 'Léa',   count: 9,  owes: 25.20 },
    { name: 'Tom',   count: 8,  owes: 22.40 },
    { name: 'Sarah', count: 6,  owes: 16.80 },
    { name: 'Hugo',  count: 5,  owes: 14.00 },
    { name: 'Inès',  count: 4,  owes: 11.20 },
  ];
  const total = 162.40;
  const fut = 168;
  return (
    <IOSDevice width={402} height={874}>
      <div style={{
        height: '100%', background: A.bg, padding: STATUS_PAD + 'px 0 40px',
        fontFamily: A.sans, color: A.ink, overflow: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 8px' }}>
          <ABadge tone="green">✓ Fût terminé</ABadge>
          <span style={{ fontFamily: A.mono, fontSize: 11, color: A.muted }}>22:14</span>
        </div>

        <div style={{ padding: '8px 24px 18px' }}>
          <div style={{ fontFamily: A.display, fontSize: 44, lineHeight: 1.0, letterSpacing: -0.8 }}>
            Fond du fût.
          </div>
          <div style={{ fontSize: 14, color: A.muted, marginTop: 8, maxWidth: 290 }}>
            58 bières · 2h27 · réparties au prorata du volume bu.
          </div>
        </div>

        {/* total card */}
        <div style={{ padding: '0 16px 18px' }}>
          <div style={{
            background: A.ink, color: A.foam, borderRadius: 24, padding: '22px 22px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: A.mono, fontSize: 10, color: 'rgba(254,248,232,0.6)', letterSpacing: 1.4, textTransform: 'uppercase' }}>
                  Prix du fût
                </div>
                <div style={{ fontFamily: A.display, fontSize: 40, marginTop: 4, lineHeight: 1 }}>{fut.toFixed(2)} €</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: A.mono, fontSize: 10, color: 'rgba(254,248,232,0.6)', letterSpacing: 1.4, textTransform: 'uppercase' }}>
                  Collecté
                </div>
                <div style={{ fontFamily: A.display, fontSize: 24, marginTop: 4, color: A.accent }}>{total.toFixed(2)} €</div>
                <div style={{ fontFamily: A.mono, fontSize: 10, color: 'rgba(254,248,232,0.5)', marginTop: 2 }}>
                  fond reste : {(fut-total).toFixed(2)} €
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* breakdown */}
        <div style={{ padding: '0 24px 8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: A.mono, fontSize: 11, letterSpacing: 1.6, color: A.muted, textTransform: 'uppercase' }}>
            Qui doit quoi
          </span>
          <span style={{ fontFamily: A.mono, fontSize: 10, color: A.muted }}>2,80 €/bière · 25cl</span>
        </div>

        <div style={{ padding: '4px 16px' }}>
          {split.map(s => (
            <div key={s.name} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 12px',
              borderRadius: s.you ? 12 : 0,
              background: s.you ? A.cardWarm : 'transparent',
              borderBottom: s.you ? 'none' : '1px solid ' + A.hairline,
              boxShadow: s.you ? 'inset 0 0 0 1.5px ' + A.ink : 'none',
              margin: s.you ? '4px 0' : 0,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 18,
                background: s.you ? A.ink : A.bgDeep,
                color: s.you ? A.foam : A.ink2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: A.display, fontSize: 16,
              }}>{s.name[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{s.name}{s.you && ' (toi)'}</div>
                <div style={{ fontFamily: A.mono, fontSize: 10, color: A.muted, marginTop: 2 }}>
                  {s.count} bières · {((s.count/58)*100).toFixed(0)}%
                </div>
              </div>
              <div style={{ fontFamily: A.display, fontSize: 24, color: A.primary }}>
                {s.owes.toFixed(2)} €
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '20px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AButton primary>
            Envoyer les demandes
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8l5 5 7-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </AButton>
          <AButton>Partager le décompte</AButton>
        </div>
      </div>
    </IOSDevice>
  );
}

// Expose to global scope for the canvas to consume
Object.assign(window, { A1_Login, A2_Home, A3_CreateSession, A4_Session, A5_AddBeer, A6_Leaderboard, A7_Stats, A8_Split });
