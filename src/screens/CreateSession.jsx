import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T, VOLUMES } from '../theme';
import { useApp } from '../context/AppContext';
import Badge from '../components/Badge';
import Btn from '../components/Btn';
import Field from '../components/Field';

function pricePerBeer(price, volume) {
  if (!price || !volume) return null;
  const beers = volume / 0.25;
  return (price / beers).toFixed(2);
}

export default function CreateSession() {
  const navigate = useNavigate();
  const { createSession, addParticipant: contextAddParticipant, activeSession } = useApp();

  const [step, setStep] = useState(1);
  const [brewery, setBrewery] = useState('');
  const [beer, setBeer] = useState('');
  const [abv, setAbv] = useState('');
  const [volume, setVolume] = useState(30);
  const [price, setPrice] = useState('');
  const [participants, setParticipants] = useState([]);
  const [newName, setNewName] = useState('');
  const [err, setErr] = useState('');

  const ppb = pricePerBeer(parseFloat(price), volume);

  const validateStep1 = () => {
    if (!brewery.trim()) return 'Renseigne la brasserie.';
    if (!beer.trim()) return 'Renseigne la bière.';
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) return 'Prix invalide.';
    return null;
  };

  const handleNext = () => {
    const e = validateStep1();
    if (e) { setErr(e); return; }
    setErr('');
    setStep(2);
  };

  const addParticipant = () => {
    const name = newName.trim();
    if (!name || participants.includes(name)) return;
    setParticipants([...participants, name]);
    setNewName('');
  };

  const handleCreate = () => {
    const session = createSession({ brewery, beer, abv, volume, price: parseFloat(price) });
    participants.forEach((name) => contextAddParticipant(session.id, name));
    navigate(`/session/${session.id}`);
  };

  return (
    <div className="screen">
      <div className="grain" />
      <div style={{ position: 'relative', padding: 'calc(env(safe-area-inset-top,0px) + 12px) 0 40px', minHeight: '100dvh' }}>
        {/* Nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 8px' }}>
          <button onClick={() => step === 1 ? navigate(-1) : setStep(1)} style={{
            fontSize: 16, color: T.primary, fontWeight: 500, background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: T.sans,
          }}>
            {step === 1 ? 'Annuler' : '← Retour'}
          </button>
          <Badge tone="amber">Étape {step} / 2</Badge>
          <div style={{ width: 60 }} />
        </div>

        <div style={{ padding: '16px 24px 22px' }}>
          <div style={{ fontFamily: T.display, fontSize: 38, lineHeight: 1.0, letterSpacing: -0.8 }}>
            {step === 1 ? 'Le fût en perce.' : 'Invite les copains.'}
          </div>
          <div style={{ fontSize: 14, color: T.muted, marginTop: 8 }}>
            {step === 1
              ? 'Renseigne-le, on calculera le prorata au goutte-près.'
              : 'Ajoute les noms des participants maintenant, ou invite-les par code pendant la session.'}
          </div>
        </div>

        {step === 1 && (
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: T.card, borderRadius: 20, padding: 20, boxShadow: `inset 0 0 0 1px ${T.hairline}` }}>
              <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, color: T.muted, textTransform: 'uppercase' }}>
                Brasserie
              </div>
              <input
                value={brewery}
                onChange={(e) => setBrewery(e.target.value)}
                placeholder="Ex: Brasserie du Mont"
                style={{ fontSize: 17, fontWeight: 600, marginTop: 6, width: '100%', background: 'none', border: 'none', color: T.ink, fontFamily: T.sans }}
              />
              <div style={{ height: 1, background: T.hairline, margin: '14px 0' }} />
              <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, color: T.muted, textTransform: 'uppercase' }}>
                Bière {' '}
                <span style={{ opacity: 0.6 }}>(+ ABV optionnel)</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={beer}
                  onChange={(e) => setBeer(e.target.value)}
                  placeholder="Ex: Triple ambrée"
                  style={{ flex: 2, fontSize: 17, fontWeight: 600, marginTop: 6, background: 'none', border: 'none', color: T.ink, fontFamily: T.sans }}
                />
                <input
                  value={abv}
                  onChange={(e) => setAbv(e.target.value)}
                  placeholder="7.2°"
                  inputMode="decimal"
                  style={{ flex: 1, fontSize: 17, fontWeight: 600, marginTop: 6, background: 'none', border: 'none', color: T.muted, fontFamily: T.sans, textAlign: 'right' }}
                />
              </div>
            </div>

            {/* Volume picker */}
            <div style={{ background: T.card, borderRadius: 20, padding: 20, boxShadow: `inset 0 0 0 1px ${T.hairline}` }}>
              <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, color: T.muted, textTransform: 'uppercase' }}>
                Volume du fût
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                {VOLUMES.map((v) => (
                  <button key={v} onClick={() => setVolume(v)} style={{
                    flex: 1, height: 56, borderRadius: 14,
                    background: volume === v ? T.ink : T.cardWarm,
                    color: volume === v ? T.foam : T.ink,
                    fontFamily: T.display, fontSize: 18,
                    boxShadow: volume === v ? 'none' : `inset 0 0 0 1px ${T.hairline}`,
                    border: 'none', cursor: 'pointer', touchAction: 'manipulation',
                  }}>{v} L</button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div style={{ background: T.card, borderRadius: 20, padding: 20, boxShadow: `inset 0 0 0 1px ${T.hairline}` }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, color: T.muted, textTransform: 'uppercase' }}>
                  Prix du fût
                </div>
                {ppb && (
                  <div style={{ fontFamily: T.mono, fontSize: 11, color: T.muted }}>
                    ≈ {ppb} €/bière (25 cl)
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 10, gap: 4 }}>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="168"
                  inputMode="decimal"
                  style={{
                    fontFamily: T.display, fontSize: 52, lineHeight: 0.95, letterSpacing: -1.5,
                    background: 'none', border: 'none', color: T.ink, width: '100%',
                  }}
                />
                <span style={{ fontFamily: T.display, fontSize: 28, color: T.muted }}>€</span>
              </div>
            </div>

            {err && (
              <div style={{ background: '#fde8e4', borderRadius: 12, padding: '12px 16px', color: T.primary, fontSize: 14 }}>
                {err}
              </div>
            )}

            <Btn primary onClick={handleNext} style={{ marginTop: 8 }}>
              Suivant — Inviter les copains
            </Btn>
          </div>
        )}

        {step === 2 && (
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: T.card, borderRadius: 20, padding: 20, boxShadow: `inset 0 0 0 1px ${T.hairline}` }}>
              <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.4, color: T.muted, textTransform: 'uppercase', marginBottom: 14 }}>
                Ajouter un participant
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
                  placeholder="Prénom"
                  style={{ flex: 1, fontSize: 16, background: T.bgDeep, border: `1px solid ${T.hairline}`, borderRadius: 10, padding: '10px 14px', color: T.ink, fontFamily: T.sans }}
                />
                <button onClick={addParticipant} style={{
                  width: 44, height: 44, borderRadius: 10, background: T.ink, color: T.foam,
                  border: 'none', cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>+</button>
              </div>
              {participants.length > 0 && (
                <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {participants.map((name) => (
                    <div key={name} style={{
                      height: 36, borderRadius: 18, padding: '0 14px',
                      background: T.bgDeep, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500,
                    }}>
                      {name}
                      <button onClick={() => setParticipants(participants.filter((n) => n !== name))} style={{
                        width: 18, height: 18, borderRadius: 9, background: T.muted, color: T.foam,
                        border: 'none', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: T.cardWarm, borderRadius: 16, padding: 16, boxShadow: `inset 0 0 0 1px ${T.hairline}` }}>
              <div style={{ fontFamily: T.mono, fontSize: 10, color: T.muted, letterSpacing: 1.2, marginBottom: 6 }}>
                INFO
              </div>
              <p style={{ fontSize: 14, color: T.ink2, margin: 0, lineHeight: 1.5 }}>
                Tu peux aussi partager le <b>code de session</b> en cours de soirée — les participants rejoignent directement depuis l'app.
              </p>
            </div>

            <Btn primary onClick={handleCreate}>
              Mettre en perce 🍺
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}
