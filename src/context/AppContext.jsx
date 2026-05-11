import { createContext, useContext, useState, useCallback } from 'react';
import {
  getUser, saveUser, clearUser,
  getSessions, upsertSession, getSession, getSessionByCode,
  deleteSession as deleteSessionStorage,
  hasOnboarded, markOnboarded,
  generateCode, generateId,
  findOrCreateAccount,
} from '../utils/storage';

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [user, setUserState] = useState(() => getUser());
  const [sessions, setSessions] = useState(() => getSessions());
  const [onboarded, setOnboarded] = useState(() => hasOnboarded());

  const refresh = useCallback(() => setSessions(getSessions()), []);

  const login = useCallback((name, email, adminOverride = false) => {
    if (adminOverride) {
      const adminUser = { id: 'beersplit-admin', name: 'Admin', email: 'admin@beersplit.local', isAdmin: true };
      saveUser(adminUser);
      setUserState(adminUser);
      return adminUser;
    }
    const u = findOrCreateAccount(email, name);
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
    refresh();
    return session;
  }, [user, refresh]);

  const joinSession = useCallback((code, participantName) => {
    const session = getSessionByCode(code);
    if (!session) return null;
    if (session.status !== 'active') return null;
    const existingUser = user || { id: generateId(), name: participantName };
    if (!session.participants.find((p) => p.id === existingUser.id)) {
      session.participants.push({ id: existingUser.id, name: participantName || existingUser.name });
      upsertSession(session);
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
    refresh();
    return p;
  }, [refresh]);

  const addDrink = useCallback((sessionId, participantId, vol) => {
    const session = getSession(sessionId);
    if (!session || session.status !== 'active') return;
    session.drinks.push({ id: generateId(), participantId, vol, ts: Date.now() });
    upsertSession(session);
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
    refresh();
  }, [refresh]);

  const finishSession = useCallback((sessionId) => {
    const session = getSession(sessionId);
    if (!session) return;
    session.status = 'finished';
    session.endDate = Date.now();
    upsertSession(session);
    refresh();
    return session;
  }, [refresh]);

  const removeParticipant = useCallback((sessionId, participantId) => {
    const session = getSession(sessionId);
    if (!session) return;
    session.participants = session.participants.filter((p) => p.id !== participantId);
    session.drinks = session.drinks.filter((d) => d.participantId !== participantId);
    upsertSession(session);
    refresh();
  }, [refresh]);

  const deleteSession = useCallback((sessionId) => {
    deleteSessionStorage(sessionId);
    refresh();
  }, [refresh]);

  const activeSession = sessions.find((s) => s.status === 'active') || null;

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
