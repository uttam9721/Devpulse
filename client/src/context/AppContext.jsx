import React, { createContext, useContext, useState, useEffect } from 'react';
import { store, REPOS, NOW, MIN, ME } from '../utils/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, setState] = useState({
    auth: store.get('auth', false),
    theme: store.get('theme', 'system'),
    range: store.get('range', 7),
    scope: 'me',
    repo: '',
    tracked: store.get('tracked', REPOS.map(r => r.id)),
    plan: store.get('plan', 'team'),
    profile: store.get('profile', { name: 'Uttam Kumar', email: 'uttam@devpulse.dev', role: 'Full Stack Developer' }),
    notif: store.get('notif', { weekly: { email: true, slack: true, discord: false }, review: { email: false, slack: true, discord: false }, trend: { email: true, slack: false, discord: false }, sync: { email: true, slack: false, discord: false } }),
    integ: store.get('integ', { slack: true, discord: false, email: true }),
    interval: store.get('interval', 30),
    live: store.get('live', true),
    ai: store.get('ai', { commits: true, priv: true, tone: 'Concise' }),
    read: store.get('read', []),
    lastSync: NOW - 12 * MIN,
    syncing: false,
    modal: null,
    pop: null,
    ui: { hide: [], prF: 'all', prQ: '', prSort: 'created', prDir: -1, prN: 10, rvN: 10, isF: 'all', isQ: '', isN: 10, repoQ: '', repoSort: 'activity', repoLang: '', reportTab: 'weekly', reportWeek: 0, rnRepo: 'ecommerce-api', rnDays: 30, rnText: '', stText: '', dev: ME, insVar: 0, insBusy: false, summRepo: null, palQ: '', palI: 0, slackQ: '', chatBusy: false, tech: false },
    chat: [],
    slack: [],
    onb: { step: 1, prog: [0, 0, 0, 0, 0], sel: null, done: false }
  });

  const updateState = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const updateUI = (key, value) => {
    setState(prev => ({ ...prev, ui: { ...prev.ui, [key]: value } }));
  };
  
  const updateStoreState = (key, value) => {
    store.set(key, value);
    updateState(key, value);
  };

  useEffect(() => {
    const root = document.documentElement;
    const isDark = state.theme === 'dark' || (state.theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (state.theme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', state.theme);
    }
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, setState, updateState, updateUI, updateStoreState }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
