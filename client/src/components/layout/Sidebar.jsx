import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ME, USERS } from '../../utils/mockData';
import { Icon, Logo } from '../common/Icons';
import { Avatar, Badge } from '../common/UI';

const NAV = [
  ['Overview', [
    ['dashboard', 'Dashboard', 'home'],
    ['repositories', 'Repositories', 'repo'],
    ['pull-requests', 'Pull requests', 'pr'],
    ['reviews', 'Code reviews', 'eye'],
    ['issues', 'Issues', 'issue'],
    ['technology', 'Technology', 'code']
  ]],
  ['People', [
    ['developers', 'Developer profile', 'user'],
    ['team', 'Team', 'team']
  ]],
  ['Insights', [
    ['reports', 'Reports', 'report'],
    ['ai', 'Ask DevPulse', 'spark']
  ]],
  ['Workspace', [
    ['integrations', 'Integrations', 'plug'],
    ['settings', 'Settings', 'sliders'],
    ['billing', 'Billing', 'card']
  ]]
];

export default function Sidebar() {
  const { state } = useAppContext();
  const me = USERS.find(u => u.id === ME) || USERS[0];
  
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] pt-[env(safe-area-inset-top,18px)] pb-[14px] px-[14px] border-r border-line bg-surface flex flex-col overflow-y-auto z-30 hidden md:flex">
      <div className="flex items-center gap-[10px] font-display font-extrabold text-[20px] tracking-[-0.03em] px-2 pb-4 pt-0.5">
        <Logo size={30} /> DevPulse
      </div>
      
      <nav className="flex flex-col" aria-label="Main">
        {NAV.map(g => (
          <div key={g[0]}>
            <h5 className="mx-2 mt-4 mb-1.5 font-sans font-medium text-[12px] text-ink-3">{g[0]}</h5>
            {g[1].map(x => {
              const path = x[0] === 'developers' ? `/developers/${ME}` : `/${x[0]}`;
              return (
                <NavLink 
                  key={x[0]} 
                  to={path}
                  className={({ isActive }) => `flex items-center gap-[11px] h-[38px] px-2.5 rounded-[9px] text-[14px] font-medium transition-colors ${isActive ? 'bg-ink text-bg' : 'text-ink-2 hover:bg-surface-2 hover:text-ink'}`}
                >
                  <Icon name={x[2]} />
                  {x[1]}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>
      
      <div className="mt-auto pt-[14px]">
        <div className="flex items-center gap-[10px] p-2.5 border border-line rounded-[12px] bg-surface-2">
          <Avatar id={ME} size="md" />
          <div className="min-w-0">
            <b className="block text-[14px] overflow-hidden text-ellipsis whitespace-nowrap">{me.name}</b>
            <Badge className="mt-0.5">{state.plan.charAt(0).toUpperCase() + state.plan.slice(1)} plan</Badge>
          </div>
        </div>
      </div>
    </aside>
  );
}
