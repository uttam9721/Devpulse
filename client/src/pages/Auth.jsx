import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Logo } from '../components/common/Icons';
import { Button } from '../components/common/UI';

export function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-[10px] font-display font-extrabold text-[24px] mb-8">
        <Logo size={40} /> DevPulse
      </div>
      <h1 className="text-4xl font-display font-bold mb-4">Developer productivity analytics</h1>
      <p className="text-ink-2 mb-8 text-lg max-w-md text-center">Gain insights into how your engineering team operates. Identify bottlenecks and track code velocity.</p>
      <Button variant="primary" size="lg" onClick={() => navigate('/login')}>Get Started</Button>
    </div>
  );
}

export function Login() {
  const { updateStoreState } = useAppContext();
  const navigate = useNavigate();
  
  const handleLogin = () => {
    updateStoreState('auth', true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-surface border border-line rounded-custom p-8 max-w-md w-full shadow-custom">
        <div className="flex flex-col items-center mb-6">
          <Logo size={48} />
          <h2 className="text-2xl font-display font-bold mt-4">Sign in to DevPulse</h2>
        </div>
        <Button variant="primary" className="w-full" size="lg" onClick={handleLogin}>Log in with GitHub</Button>
      </div>
    </div>
  );
}

export function Onboarding() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2>Welcome to DevPulse</h2>
      <Button variant="primary" onClick={() => navigate('/dashboard')}>Finish Setup</Button>
    </div>
  );
}
