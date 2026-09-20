import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ME, ago } from '../../utils/mockData';
import { Icon, Logo } from '../common/Icons';
import { Avatar } from '../common/UI';

export default function Topbar() {
  const { state, updateState } = useAppContext();
  const isDark = state.theme === 'dark' || (state.theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    updateState('theme', isDark ? 'light' : 'dark');
  };

  const handleSync = () => {
    if (state.syncing) return;
    updateState('syncing', true);
    setTimeout(() => {
      updateState('syncing', false);
      updateState('lastSync', Date.now());
    }, 1400);
  };

  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-25 flex items-center gap-2 p-[10px_16px] md:p-[12px_28px] bg-bg/85 backdrop-blur-[12px] border-b border-transparent">
      <NavLink to="/dashboard" className="flex md:hidden items-center gap-2 font-display font-extrabold text-[18px] tracking-[-0.03em]">
        <Logo size={28} />
      </NavLink>
      
      <button className="flex items-center justify-center md:justify-start gap-2.5 h-[38px] px-0 md:px-3 min-w-0 md:min-w-[min(340px,40vw)] border border-line-2 rounded-[10px] bg-surface text-ink-3 text-[14px] flex-none md:flex-1 shrink-0 w-[38px] md:w-auto" onClick={() => updateState('modal', {type: 'pal'})} aria-label="Search">
        <Icon name="search" />
        <span className="hidden md:inline">Search or jump to…</span>
        <kbd className="hidden md:inline ml-auto font-sans font-medium text-[11px] border border-line-2 rounded-[5px] px-1.5 py-px text-ink-3">Ctrl K</kbd>
      </button>
      
      <span className="flex-1 md:hidden"></span>
      
      <button className={`inline-flex items-center gap-2 h-[38px] px-2.5 md:px-3 border border-line-2 rounded-[10px] bg-surface text-[13px] font-medium text-ink-2 hover:bg-surface-2 transition-colors ${state.syncing ? 'pointer-events-none' : ''}`} onClick={handleSync}>
        <i className={`w-2 h-2 rounded-full ${state.syncing ? 'bg-c-issue' : 'bg-good shadow-[0_0_0_0_rgba(11,138,123,0.6)] animate-[beat_2.4s_infinite]'}`}></i>
        <Icon name="sync" size="tiny" className={state.syncing ? 'animate-spin' : ''} />
        <span className="hidden sm:inline">{state.syncing ? 'Syncing…' : 'Synced ' + ago(state.lastSync)}</span>
      </button>
      
      <div className="relative">
        <button className="w-[38px] h-[38px] flex items-center justify-center border border-transparent rounded-[10px] hover:bg-surface-2 transition-colors" aria-label="Notifications">
          <Icon name="bell" />
        </button>
      </div>
      
      <button className="w-[38px] h-[38px] flex items-center justify-center border border-transparent rounded-[10px] hover:bg-surface-2 transition-colors" onClick={toggleTheme} aria-label="Toggle theme">
        <Icon name={isDark ? 'sun' : 'moon'} />
      </button>
      
      <div className="relative">
        <button className="grid place-items-center w-[38px] h-[38px]" aria-label="Account menu">
          <Avatar id={ME} size="md" />
        </button>
      </div>
    </header>
  );
}
