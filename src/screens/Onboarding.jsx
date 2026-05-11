import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from '../theme';
import { useApp } from '../context/AppContext';
import PintMark from '../components/PintMark';
import Btn from '../components/Btn';

const SLIDES = [
  {
    badge: '01 / 03',
    title: 'Le fût, partagé honnêtement.',
    body: 'Une tireuse, plusieurs gosiers. BeerSplit compte chaque bière et calcule le prorata exact — pas de parts égales à l\'aveugle.',
    bg: T.ink,
    fg: T.foam,
  },
  {
    badge: '02 / 03',
    title: '2 taps pour compter.',
    body: 'Un grand bouton +1 toujours à portée. Long-press pour choisir la taille (demi, pinte, sérieuse) et pour qui.',
    bg: T.primary,
    fg: T.foam,
  },
  {
    badge: '03 / 03',
    title: 'Le classement, la vérité.',
    body: 'Qui tient le rythme, qui se ménage ? Les stats transforment chaque soirée en souvenir. Le split final, c\'est zéro embrouille.',
    bg: T.bg,
    fg: T.ink,
  },
];

export default function Onboarding() {
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();
  const { finishOnboarding } = useApp();
  const slide = SLIDES[idx];

  const next = () => {
    if (idx < SLIDES.length - 1) setIdx(idx + 1);
    else { finishOnboarding(); navigate('/login'); }
  };

  return (
    <div style={{
      height: '100dvh', background: slide.bg, color: slide.fg,
      display: 'flex', flexDirection: 'column',
      padding: 'calc(env(safe-area-inset-top,0px) + 48px) 28px calc(env(safe-area-inset-bottom,0px) + 48px)',
      transition: 'background 0.4s ease',
    }}>
      <div className="grain" style={{ opacity: 0.25 }} />

      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <PintMark size={48} color={slide.fg} />
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 1.6, marginTop: 32, marginBottom: 16, opacity: 0.6 }}>
            {slide.badge}
          </div>
          <div style={{ fontFamily: T.display, fontSize: 42, lineHeight: 1.0, letterSpacing: -0.8 }}>
            {slide.title}
          </div>
          <p style={{ fontFamily: T.sans, fontSize: 16, lineHeight: 1.5, marginTop: 16, opacity: 0.75 }}>
            {slide.body}
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
            {SLIDES.map((_, i) => (
              <div key={i} onClick={() => setIdx(i)} style={{
                height: 4, borderRadius: 2, cursor: 'pointer',
                flex: i === idx ? 2 : 1,
                background: slide.fg,
                opacity: i === idx ? 1 : 0.3,
                transition: 'flex 0.3s ease, opacity 0.3s',
              }} />
            ))}
          </div>

          <Btn primary={slide.bg !== T.ink && slide.bg !== T.primary} onClick={next} style={{
            background: slide.fg, color: slide.bg,
            boxShadow: 'none',
          }}>
            {idx < SLIDES.length - 1 ? 'Suivant' : 'Commencer'}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Btn>

          {idx < SLIDES.length - 1 && (
            <button onClick={() => { finishOnboarding(); navigate('/login'); }} style={{
              width: '100%', marginTop: 16, fontFamily: T.sans, fontSize: 14,
              color: slide.fg, opacity: 0.5, background: 'none', border: 'none',
              cursor: 'pointer', textAlign: 'center',
            }}>
              Passer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
