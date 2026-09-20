import React from 'react';
import { Icon } from './Icons';

export function KPI({ label, color, val, foot, extra }) {
  return (
    <div className="bg-surface p-[16px_18px] min-w-0">
      <div className="flex items-center gap-2 text-ink-2 text-[13px]">
        {color && <i className="inline-block w-2 h-2 rounded-full shrink-0" style={{ background: `var(--color-${color.replace('--c-','')})` }}></i>}
        {label}
      </div>
      <div className="text-[34px] font-bold mt-2 leading-none num">
        {val}
      </div>
      <div className="flex justify-between items-end mt-3 gap-2 min-h-[28px]">
        <span>{foot}</span>
        {extra}
      </div>
    </div>
  );
}

export function DeltaChip({ p, o = {} }) {
  const up = p >= 0;
  let cls = '';
  if (o.tone) {
    const good = o.inv ? p < 0 : p > 0;
    cls = p === 0 ? '' : good ? 'text-good bg-good/12' : 'text-bad bg-bad/11';
  } else {
    cls = 'bg-surface-2 text-ink-2'; // Default
  }

  return (
    <span className={`inline-flex items-center gap-[3px] text-[12px] font-medium px-[7px] py-[2px] rounded-full whitespace-nowrap ${cls}`}>
      <Icon name={up ? 'up' : 'down'} size="tiny" />
      {Math.abs(p)}%
    </span>
  );
}
