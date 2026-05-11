import { db } from '../firebase';
import { ref, set, get, remove, onValue, off } from 'firebase/database';

const KEYS = {
  user: 'bs_user',
  accounts: 'bs_accounts',
  sessions: 'bs_sessions',
  onboarded: 'bs_onboarded',
};

function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(key)); }
  catch { return null; }
}

function lsSet(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

export function getUser() { return lsGet(KEYS.user); }
export function saveUser(user) { lsSet(KEYS.user, user); }
export function clearUser() { localStorage.removeItem(KEYS.user); }

function getAccounts() { return lsGet(KEYS.accounts) || {}; }
function saveAccounts(a) { lsSet(KEYS.accounts, a); }

// Firebase key: email can't contain '.' or '@'
function fbEmailKey(email) {
  return email.toLowerCase().trim().replace(/\./g, '_').replace(/@/, '__');
}

export function findOrCreateAccount(email, name) {
  const accounts = getAccounts();
  const key = email.toLowerCase().trim();
  if (accounts[key]) {
    if (name) accounts[key].name = name;
    saveAccounts(accounts);
    return accounts[key];
  }
  const user = { id: generateId(), name: name || email.split('@')[0], email: key };
  accounts[key] = user;
  saveAccounts(accounts);
  return user;
}

// Sync account to Firebase (fire-and-forget)
export async function syncAccount(user) {
  if (!db) return;
  try { await set(ref(db, `accounts/${fbEmailKey(user.email)}`), user); } catch {}
}

// Fetch account from Firebase by email
export async function fetchRemoteAccount(email) {
  if (!db) return null;
  try {
    const snap = await get(ref(db, `accounts/${fbEmailKey(email)}`));
    return snap.exists() ? snap.val() : null;
  } catch { return null; }
}

export function hasOnboarded() { return !!lsGet(KEYS.onboarded); }
export function markOnboarded() { lsSet(KEYS.onboarded, true); }

export function getSessions() { return lsGet(KEYS.sessions) || []; }
export function saveSessions(sessions) { lsSet(KEYS.sessions, sessions); }

export function getSession(id) {
  return getSessions().find((s) => s.id === id) || null;
}

export function getSessionByCode(code) {
  return getSessions().find((s) => s.code === code.toUpperCase()) || null;
}

export function upsertSession(session) {
  const sessions = getSessions();
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) sessions[idx] = session;
  else sessions.unshift(session);
  saveSessions(sessions);
}

export function deleteSession(id) {
  saveSessions(getSessions().filter((s) => s.id !== id));
}

// Sync session to Firebase (fire-and-forget)
export async function syncSession(session) {
  if (!db) return;
  try { await set(ref(db, `sessions/${session.id}`), session); } catch {}
}

// Delete session from Firebase (fire-and-forget)
export async function deleteSessionRemote(id) {
  if (!db) return;
  try { await remove(ref(db, `sessions/${id}`)); } catch {}
}

// Fetch session by code from Firebase
export async function fetchSessionByCode(code) {
  if (!db) return null;
  try {
    const snap = await get(ref(db, 'sessions'));
    if (!snap.exists()) return null;
    const all = Object.values(snap.val());
    return all.find((s) => s.code === code.toUpperCase()) || null;
  } catch { return null; }
}

// Realtime listener on a single session (for live updates in Session screen)
export function subscribeToSession(sessionId, callback) {
  if (!db) return () => {};
  const r = ref(db, `sessions/${sessionId}`);
  onValue(r, (snap) => { if (snap.exists()) callback(snap.val()); });
  return () => off(r);
}

export function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function computeStats(userId) {
  const sessions = getSessions().filter((s) => s.status === 'finished');
  const now = new Date();
  const thisYear = now.getFullYear();

  let totalBeers = 0;
  let totalPaid = 0;
  let kegsFinished = 0;
  const beerCounts = {};
  const weekdayCounts = Array(7).fill(0);
  const monthCounts = Array(12).fill(0);

  sessions.forEach((s) => {
    const userDrinks = s.drinks.filter((d) => d.participantId === userId);
    if (!userDrinks.length) return;

    const sessionYear = new Date(s.startDate).getFullYear();
    const totalVol = s.drinks.reduce((a, d) => a + d.vol, 0);
    const userVol = userDrinks.reduce((a, d) => a + d.vol, 0);
    const rate = totalVol > 0 ? s.price / s.volume : 0;
    const userPaid = userVol * rate;

    if (sessionYear === thisYear) {
      totalBeers += userDrinks.filter((d) => d.vol === 0.25).length;
      totalPaid += userPaid;
      kegsFinished++;

      const beerKey = `${s.brewery} — ${s.beer}`;
      beerCounts[beerKey] = (beerCounts[beerKey] || 0) + userDrinks.length;

      userDrinks.forEach((d) => {
        const dt = new Date(d.ts);
        weekdayCounts[dt.getDay()]++;
        if (dt.getFullYear() === thisYear) monthCounts[dt.getMonth()]++;
      });
    }
  });

  const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const bestDayIdx = weekdayCounts.indexOf(Math.max(...weekdayCounts));
  const bestDay = DAYS[bestDayIdx] || 'Sam';

  const favBeer = Object.entries(beerCounts).sort((a, b) => b[1] - a[1])[0];

  const startOfYear = new Date(thisYear, 0, 1);
  const weeksPassed = Math.max(1, Math.ceil((now - startOfYear) / (7 * 86400000)));

  return {
    totalBeers,
    totalPaid: Math.round(totalPaid * 100) / 100,
    kegsFinished,
    avgPerWeek: Math.round((totalBeers / weeksPassed) * 10) / 10,
    bestDay,
    favBeer: favBeer ? favBeer[0] : null,
    monthCounts,
  };
}
