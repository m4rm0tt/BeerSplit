import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';

import Onboarding    from './screens/Onboarding';
import Login         from './screens/Login';
import Home          from './screens/Home';
import CreateSession from './screens/CreateSession';
import Session       from './screens/Session';
import Leaderboard   from './screens/Leaderboard';
import Split         from './screens/Split';
import Stats         from './screens/Stats';
import History       from './screens/History';
import Profile       from './screens/Profile';

function Guard({ children }) {
  const { user, onboarded } = useApp();
  if (!onboarded) return <Navigate to="/onboarding" replace />;
  if (!user)      return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/" element={<Guard><Home /></Guard>} />
        <Route path="/create"     element={<Guard><CreateSession /></Guard>} />
        <Route path="/session/:id"    element={<Guard><Session /></Guard>} />
        <Route path="/leaderboard/:id" element={<Guard><Leaderboard /></Guard>} />
        <Route path="/split/:id"  element={<Guard><Split /></Guard>} />
        <Route path="/stats"      element={<Guard><Stats /></Guard>} />
        <Route path="/history"    element={<Guard><History /></Guard>} />
        <Route path="/profile"    element={<Guard><Profile /></Guard>} />
        <Route path="*"           element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
