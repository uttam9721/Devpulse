import React from 'react';
import { USERS } from '../../utils/mockData';
import { Icon } from './Icons';

export function Button({ children, variant = 'default', size = 'default', icon, className = '', disabled, onClick, ...props }) {
  let baseClasses = 'inline-flex items-center justify-center gap-2 h-[38px] px-3.5 rounded-[10px] border border-line-2 bg-surface font-medium text-[14px] whitespace-nowrap transition-all duration-150';
  
  if (variant === 'primary') baseClasses = 'inline-flex items-center justify-center gap-2 h-[38px] px-3.5 rounded-[10px] border border-accent bg-accent font-medium text-[14px] text-on-accent whitespace-nowrap transition-all duration-150 hover:brightness-95';
  else if (variant === 'dark') baseClasses = 'inline-flex items-center justify-center gap-2 h-[38px] px-3.5 rounded-[10px] border border-ink bg-ink font-medium text-[14px] text-bg whitespace-nowrap transition-all duration-150 hover:brightness-110';
  else if (variant === 'ghost') baseClasses = 'inline-flex items-center justify-center gap-2 h-[38px] px-3.5 rounded-[10px] border border-transparent bg-transparent font-medium text-[14px] whitespace-nowrap transition-all duration-150 hover:bg-surface-2';
  else if (variant === 'danger') baseClasses = 'inline-flex items-center justify-center gap-2 h-[38px] px-3.5 rounded-[10px] border border-bad/40 bg-surface text-bad font-medium text-[14px] whitespace-nowrap transition-all duration-150 hover:bg-surface-2';
  else baseClasses += ' hover:bg-surface-2'; // default hover

  if (size === 'sm') baseClasses = baseClasses.replace('h-[38px] px-3.5 rounded-[10px] text-[14px]', 'h-[32px] px-[11px] rounded-[8px] text-[13px]');
  if (size === 'lg') baseClasses = baseClasses.replace('h-[38px] px-3.5 rounded-[10px] text-[14px]', 'h-[46px] px-[20px] rounded-[12px] text-[15px]');
  if (size === 'icon') baseClasses = baseClasses.replace('px-3.5', 'w-[38px] px-0');
  if (size === 'icon-sm') baseClasses = baseClasses.replace('h-[38px] px-3.5 rounded-[10px]', 'w-[32px] h-[32px] px-0 rounded-[8px]');

  if (disabled) baseClasses += ' opacity-50 cursor-not-allowed';

  return (
    <button className={`${baseClasses} ${className}`} disabled={disabled} onClick={onClick} {...props}>
      {icon && <Icon name={icon} size={size === 'sm' || size === 'icon-sm' ? 'tiny' : undefined} />}
      {children}
    </button>
  );
}

export function Avatar({ id, size = 'default', className = '' }) {
  const u = USERS.find(u => u.id === id) || USERS[0];
  const initials = u.name.split(' ').map(x => x[0]).join('').slice(0, 2);
  
  let sizeClasses = 'w-[28px] h-[28px] text-[11px]';
  if (size === 'lg') sizeClasses = 'w-[64px] h-[64px] text-[22px]';
  else if (size === 'md') sizeClasses = 'w-[36px] h-[36px] text-[13px]';
  else if (size === 'sm') sizeClasses = 'w-[22px] h-[22px] text-[9px]';

  return (
    <span 
      className={`inline-grid place-items-center rounded-full font-bold text-white shrink-0 font-sans ${sizeClasses} ${className}`} 
      style={{ background: u.color }}
      title={u.name}
    >
      {initials}
    </span>
  );
}

export function Badge({ children, variant, className = '' }) {
  let vClass = 'text-ink-2 bg-surface-2 border-line';
  if (variant === 'merged' || variant === 'pr') vClass = 'text-c-pr border-c-pr/35 bg-c-pr/10';
  else if (variant === 'open' || variant === 'approved' || variant === 'good') vClass = 'text-good border-good/35 bg-good/10';
  else if (variant === 'closed' || variant === 'changes' || variant === 'bad') vClass = 'text-bad border-bad/35 bg-bad/10';
  else if (variant === 'commented' || variant === 'warn') vClass = 'text-warn border-warn/35 bg-warn/10';
  else if (variant === 'pro') vClass = 'bg-accent text-on-accent border-accent';

  return (
    <span className={`inline-flex items-center gap-[5px] text-[12px] font-medium px-[9px] py-[2px] rounded-full border whitespace-nowrap ${vClass} ${className}`}>
      {children}
    </span>
  );
}

export function Chip({ children, active, onClick, className = '' }) {
  return (
    <button 
      onClick={onClick}
      className={`inline-flex items-center gap-[6px] h-[30px] px-3 rounded-full border text-[13px] font-medium whitespace-nowrap transition-colors
        ${active ? 'bg-ink border-ink text-bg' : 'border-line-2 bg-surface text-ink-2 hover:bg-surface-2'} ${className}`}
    >
      {children}
    </button>
  );
}

export function Input({ className = '', label, error, ...props }) {
  const input = <input className={`h-[38px] rounded-[10px] border border-line-2 bg-surface text-ink px-3 font-inherit text-[14px] w-full placeholder:text-ink-3 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${className}`} {...props} />;
  
  if (label) {
    return (
      <label className="block text-[13px] font-medium text-ink-2">
        {label}
        <div className="mt-1.5 font-normal">{input}</div>
        {error && <div className="text-bad text-[12.5px] mt-[5px]">{error}</div>}
      </label>
    );
  }
  return input;
}

export function Select({ className = '', options = [], ...props }) {
  return (
    <select className={`h-[38px] rounded-[10px] border border-line-2 bg-surface text-ink px-3 pr-2 font-inherit text-[14px] w-auto max-w-full focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${className}`} {...props}>
      {options.map((opt, i) => (
        <option key={i} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

export function Toggle({ checked, onChange, label, className = '' }) {
  return (
    <label className={`relative inline-block w-[40px] h-[24px] shrink-0 cursor-pointer ${className}`}>
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <i className={`absolute inset-0 rounded-full transition-colors duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-accent peer-focus-visible:outline-offset-2 ${checked ? 'bg-good' : 'bg-line-2'}`}>
        <span className={`absolute left-[3px] top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-transform duration-150 shadow-sm ${checked ? 'translate-x-[16px]' : ''}`}></span>
      </i>
      {label && <span className="sr-only">{label}</span>}
    </label>
  );
}
