import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { REPOS } from '../../utils/mockData';
import { Icon } from '../common/Icons';

export function Panel({ title, sub, right, children, className = '', flat }) {
  return (
    <section className={`bg-surface border rounded-custom p-[18px] min-w-0 ${flat ? 'bg-transparent border-dashed border-line-2' : 'border-line'} ${className}`}>
      {title && (
        <div className="flex items-center gap-[10px] flex-wrap mb-[14px]">
          <h3 className="text-[17px]">{title}</h3>
          {sub && <span className="text-ink-2 text-[13px]" dangerouslySetInnerHTML={{ __html: sub }}></span>}
          <div className="ml-auto flex gap-2 items-center flex-wrap">
            {right}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}

export function PageHeader({ title, sub, right }) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap my-[18px] mb-[20px]">
      <div>
        <h1 className="text-[clamp(26px,4vw,34px)] font-extrabold tracking-[-0.03em]">{title}</h1>
        {sub && <p className="text-ink-2 mt-1.5">{sub}</p>}
      </div>
      <div className="ml-auto flex gap-2 items-center flex-wrap">
        {right}
      </div>
    </div>
  );
}

export function Filters({ scope = true, range = true, repo = true }) {
  const { state, updateState } = useAppContext();
  const free = state.plan === 'free';
  const tracked = new Set(state.tracked);

  const handleScope = (v) => updateState('scope', v);
  const handleRange = (v) => {
    if (free && v === 90) {
      alert('90-day analytics is part of Pro. See Billing to upgrade.');
    } else {
      updateState('range', v);
    }
  };
  const handleRepo = (e) => updateState('repo', e.target.value);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {scope && (
        <div className="inline-flex bg-surface-2 border border-line rounded-[10px] p-[3px] gap-[2px] max-w-full" role="group" aria-label="Scope">
          {[
            ['me', 'Just me'],
            ['team', 'Whole team']
          ].map(x => (
            <button
              key={x[0]}
              onClick={() => handleScope(x[0])}
              aria-pressed={state.scope === x[0]}
              className={`h-[30px] px-3 rounded-[7px] text-[13px] font-medium inline-flex items-center gap-[5px] whitespace-nowrap transition-colors ${state.scope === x[0] ? 'bg-surface text-ink shadow-[0_1px_2px_rgba(14,26,46,0.18)]' : 'text-ink-2 hover:text-ink'}`}
            >
              {x[1]}
            </button>
          ))}
        </div>
      )}

      {range && (
        <div className="inline-flex bg-surface-2 border border-line rounded-[10px] p-[3px] gap-[2px] max-w-full" role="group" aria-label="Date range">
          {[7, 30, 90].map(v => {
            const lock = free && v === 90;
            const active = state.range === v;
            return (
              <button
                key={v}
                onClick={() => handleRange(v)}
                aria-pressed={active}
                className={`h-[30px] px-3 rounded-[7px] text-[13px] font-medium inline-flex items-center gap-[5px] whitespace-nowrap transition-colors ${active ? 'bg-surface text-ink shadow-[0_1px_2px_rgba(14,26,46,0.18)]' : 'text-ink-2 hover:text-ink'}`}
              >
                {v} days
                {lock && <Icon name="lock" size="tiny" />}
              </button>
            );
          })}
        </div>
      )}

      {repo && (
        <select
          className="h-[38px] rounded-[10px] border border-line-2 bg-surface text-ink px-3 pr-2 font-inherit text-[14px] w-auto max-w-full focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          value={state.repo}
          onChange={handleRepo}
          aria-label="Repository"
        >
          <option value="">All repositories</option>
          {REPOS.filter(r => tracked.has(r.id)).map(r => (
            <option key={r.id} value={r.id}>{r.id}</option>
          ))}
        </select>
      )}
    </div>
  );
}

export function EmptyState({ title, desc }) {
  return (
    <div className="py-[28px] px-4 text-center text-ink-2">
      <b className="block text-ink font-display text-[17px] mb-1">{title}</b>
      {desc && <span dangerouslySetInnerHTML={{ __html: desc }}></span>}
    </div>
  );
}
