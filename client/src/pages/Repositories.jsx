import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { sliceState, bucketize } from '../utils/helpers';
import { REPOS, DB } from '../utils/mockData';
import { PageHeader, Filters, Panel } from '../components/layout/Panel';
import { Sparkline } from '../components/charts/Charts';
import { Badge, Input, Select, Chip, Button } from '../components/common/UI';
import { Icon } from '../components/common/Icons';

export default function Repositories() {
  const { state, updateUI } = useAppContext();
  const sl = sliceState(null, state);
  const tracked = new Set(state.tracked);
  
  const repos = useMemo(() => {
    return REPOS.filter(r => tracked.has(r.id)).map(r => {
      const c = sl.commits.filter(x => x.repo === r.id);
      const p = sl.prs.filter(x => x.repo === r.id);
      const v = sl.reviews.filter(x => x.repo === r.id);
      const i = sl.issClosed.filter(x => x.repo === r.id);
      
      const act = c.length + p.length + v.length + i.length;
      const rsl = sliceState({ all: true }, { ...state, repo: r.id });
      const b = bucketize(rsl);
      return { ...r, act, c: c.length, p: p.length, v: v.length, i: i.length, spark: b.total };
    });
  }, [sl, tracked, state]);

  let filtered = repos;
  if (state.ui.repoQ) filtered = filtered.filter(r => r.id.toLowerCase().includes(state.ui.repoQ.toLowerCase()) || r.desc.toLowerCase().includes(state.ui.repoQ.toLowerCase()));
  if (state.ui.repoLang) filtered = filtered.filter(r => r.lang === state.ui.repoLang);

  filtered.sort((a, b) => {
    if (state.ui.repoSort === 'activity') return b.act - a.act;
    if (state.ui.repoSort === 'name') return a.id.localeCompare(b.id);
    return b.stars - a.stars;
  });

  const langs = [...new Set(repos.map(r => r.lang))].sort();

  return (
    <>
      <PageHeader title="Repositories" right={<Filters repo={false} />} />

      <div className="flex flex-wrap gap-3 items-center mb-6">
        <Input 
          placeholder="Find a repository..." 
          className="w-[280px]" 
          value={state.ui.repoQ} 
          onChange={e => updateUI('repoQ', e.target.value)} 
        />
        <Select 
          value={state.ui.repoLang} 
          onChange={e => updateUI('repoLang', e.target.value)}
          options={[{ value: '', label: 'Language: All' }, ...langs.map(l => ({ value: l, label: `Language: ${l}` }))]}
        />
        <Select 
          value={state.ui.repoSort} 
          onChange={e => updateUI('repoSort', e.target.value)}
          options={[
            { value: 'activity', label: 'Sort: Most active' },
            { value: 'name', label: 'Sort: Name' },
            { value: 'stars', label: 'Sort: Stars' }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(r => (
          <Link key={r.id} to={`/repositories/${r.id}`} className="block group h-full">
            <Panel className="h-full flex flex-col hover:border-ink transition-colors duration-200">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-[17px] font-semibold text-ink group-hover:text-accent transition-colors flex items-center gap-2">
                  <Icon name={r.priv ? 'lock' : 'repo'} size="tiny" className="text-ink-3" />
                  {r.id}
                </h3>
                <Badge variant={r.priv ? 'default' : 'merged'}>{r.priv ? 'Private' : 'Public'}</Badge>
              </div>
              <p className="text-[14px] text-ink-2 mb-4 line-clamp-2 min-h-[42px]">{r.desc}</p>
              
              <div className="mt-auto">
                <div className="flex items-center gap-4 text-[13px] text-ink-3 mb-4">
                  <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full" style={{ background: r.col }}></i>{r.lang}</span>
                  <span className="flex items-center gap-1.5"><Icon name="star" size="tiny" />{r.stars}</span>
                </div>
                
                <div className="pt-3 border-t border-line flex items-end justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-medium text-ink-3 uppercase tracking-wider mb-1">Activity ({sl.days}d)</div>
                    <div className="text-[20px] font-bold num">{r.act}</div>
                  </div>
                  <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                    <Sparkline data={r.spark} color={r.col} width={100} height={32} />
                  </div>
                </div>
              </div>
            </Panel>
          </Link>
        ))}
      </div>
    </>
  );
}
