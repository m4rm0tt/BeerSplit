import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  getUser, saveUser, clearUser,
  getSessions, upsertSession, getSession, getSessionByCode,
  deleteSession as deleteSessionStorage,
  hasOnboarded, markOnboarded,
  generateCode, generateId,
  findOrCreateAccount,
  syncSession, syncAccount, fetchRemoteAccount, fetchSessionByCode,
  deleteSessionRemote,
} from '../utils/storage';

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [user, setUserState] = useState(() => getUser());
  const [sessions, setSessions] = useState(() => getSessions());
  const [onboarded, setOnboarded] = useState(() => hasOnboarded());

  const refresh = useCallback(() => setSessions(getSessions()), []);

  // Login: check Firebase first so same email → same ID on all devices
  const login = useCallback(async (name, email, adminOverride = false) => {
    if (adminOverride) {
      const adminUser = { id: 'beersplit-admin', name: 'Admin', email: 'admin@beersplit.local', isAdmin: true };
      saveUser(adminUser);
      setUserState(adminUser);
      return adminUser;
    }
    // Try Firebase to get consistent account across devices
    let u = await fetchRemoteAccount(email);
    if (u) {
      if (name && name !== u.name) u.name = name;
      const accounts = JSON.parse(localStorage.getItem('bs_accounts') || '{}');
      accounts[email.toLowerCase().trim()] = u;
      localStorage.setItem('bs_accounts', JSON.stringify(accounts));
    } else {
      u = findOrCreateAccount(email, name);
      syncAccount(u);
    }
    saveUser(u);
    setUserState(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    clearUser();
    setUserState(null);
  }, []);

  const finishOnboarding = useCallback(() => {
    markOnboarded();
    setOnboarded(true);
  }, []);

  const createSession = useCallback((data) => {
    const session = {
      id: generateId(),
      code: generateCode(),
      brewery: data.brewery,
      beer: data.beer,
      abv: data.abv || '',
      volume: data.volume,
      price: data.price,
      surcharge: data.surcharge || 0,
      startDate: Date.now(),
      endDate: null,
      status: 'active',
      hostId: user.id,
      participants: [{ id: user.id, name: user.name }],
      drinks: [],
    };
    upsertSession(session);
    syncSession(session);
    refresh();
    return session;
  }, [user, refresh]);

  // joinSession: checks local cache first, then Firebase
  const joinSession = useCallback(async (code, participantName) => {
    let session = getSessionByCode(code);
    if (!session) {
      session = await fetchSessionByCode(code);
      if (session) upsertSession(session);
    }
    if (!session || session.status !== 'active') return null;
    const existingUser = user || { id: generateId(), name: participantName };
    if (!session.participants.find((p) => p.id === existingUser.id)) {
      session.participants.push({ id: existingUser.id, name: participantName || existingUser.name });
      upsertSession(session);
      syncSession(session);
      refresh();
    }
    return session;
  }, [user, refresh]);

  const addParticipant = useCallback((sessionId, name) => {
    const session = getSession(sessionId);
    if (!session) return;
    const exists = session.participants.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (exists) return exists;
    const p = { id: generateId(), name };
    session.participants.push(p);
    upsertSession(session);
    syncSession(session);
    refresh();
    return p;
  }, [refresh]);

  const addDrink = useCallback((sessionId, participantId, vol) => {
    const session = getSession(sessionId);
    if (!session || session.status !== 'active') return;
    session.drinks.push({ id: generateId(), participantId, vol, ts: Date.now() });
    upsertSession(session);
    syncSession(session);
    refresh();
  }, [refresh]);

  const undoLastDrink = useCallback((sessionId, participantId) => {
    const session = getSession(sessionId);
    if (!session) return;
    const idx = [...session.drinks].reverse().findIndex((d) => d.participantId === participantId);
    if (idx === -1) return;
    const realIdx = session.drinks.length - 1 - idx;
    session.drinks.splice(realIdx, 1);
    upsertSession(session);
    syncSession(session);
    refresh();
  }, [refresh]);

  const finishSession = useCallback((sessionId) => {
    const session = getSession(sessionId);
    if (!session) return;
    session.status = 'finished';
    session.endDate = Date.now();
    upsertSession(session);
    syncSession(session);
    refresh();
    return session;
  }, [refresh]);

  const removeParticipant = useCallback((sessionId, participantId) => {
    const session = getSession(sessionId);
    if (!session) return;
    session.participants = session.participants.filter((p) => p.id !== participantId);
    session.drinks = session.drinks.filter((d) => d.participantId !== participantId);
    upsertSession(session);
    syncSession(session);
    refresh();
  }, [refresh]);

  const deleteSession = useCallback((sessionId) => {
    deleteSessionStorage(sessionId);
    deleteSessionRemote(sessionId);
    refresh();
  }, [refresh]);

  // activeSession only counts if the current user is a participant
  const activeSession = sessions.find((s) =>
    s.status === 'active' &&
    s.participants.some((p) => p.id === user?.id)
  ) || null;

  return (
    <Ctx.Provider value={{
      user, login, logout,
      onboarded, finishOnboarding,
      sessions, refresh,
      activeSession,
      createSession, joinSession, addParticipant,
      addDrink, undoLastDrink, finishSession,
      removeParticipant, deleteSession,
      getSession,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => useContext(Ctx);
