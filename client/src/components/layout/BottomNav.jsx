import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '../common/Icons';

export default function BottomNav() {
  const bn = (id, t, i, h) => (
    <NavLink 
      to={h || `/${id}`}
      className={({ isActive }) => `flex-1 flex flex-col items-center gap-0.5 text-[11px] font-medium py-1.5 rounded-[10px] ${isActive ? 'text-accent' : 'text-ink-3'}`}
    >
      <Icon name={i} size="big" />
      {t}
    </NavLink>
  );

  return (
    <nav className="flex md:hidden fixed left-0 right-0 bottom-0 z-40 bg-surface border-t border-line p-[6px_6px_calc(6px+env(safe-area-inset-bottom,0px))]">
      {bn('dashboard', 'Home', 'home')}
      {bn('repositories', 'Repos', 'repo')}
      {bn('pull-requests', 'PRs', 'pr')}
      {bn('ai', 'Ask AI', 'spark')}
      <button className="flex-1 flex flex-col items-center gap-0.5 text-[11px] font-medium py-1.5 rounded-[10px] text-ink-3">
        <Icon name="menu" size="big" />
        More
      </button>
    </nav>
  );
}
