import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Repositories from './pages/Repositories';
import PullRequests from './pages/PullRequests';
import Reviews from './pages/Reviews';
import Issues from './pages/Issues';
import Technology from './pages/Technology';
import DeveloperProfile from './pages/DeveloperProfile';
import Team from './pages/Team';
import Reports from './pages/Reports';
import AskAI from './pages/AskAI';
import Integrations from './pages/Integrations';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import { Landing, Login, Onboarding } from './pages/Auth';

function App() {
  const { state } = useAppContext();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes inside Layout */}
      <Route element={state.auth ? <Layout /> : <Navigate to="/login" replace />}>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/repositories" element={<Repositories />} />
        <Route path="/pull-requests" element={<PullRequests />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/developers/:id" element={<DeveloperProfile />} />
        <Route path="/team" element={<Team />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/ai" element={<AskAI />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/billing" element={<Billing />} />
      </Route>
    </Routes>
  );
}

export default App;
