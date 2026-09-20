import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { sliceState, prStats } from '../utils/helpers';
import { U, ago } from '../utils/mockData';
import { PageHeader, Filters, Panel, EmptyState } from '../components/layout/Panel';
import { Badge, Input, Select, Avatar, Button } from '../components/common/UI';
import { Icon, GhIcon } from '../components/common/Icons';

function statCard(v, l, c = '') {
  return (
    <div className={`p-4 rounded-custom border border-line bg-surface flex flex-col justify-center items-center text-center ${c}`}>
      <div className="text-[32px] font-bold leading-none num">{v}</div>
      <div className="text-ink-2 text-[13px] mt-1.5">{l}</div>
    </div>
  );
}

export default function PullRequests() {
  const { state, updateUI } = useAppContext();
  const sl = sliceState(null, state);
  
  const { total, merged, open, closed, avgReview, avgMerge, mergeRate, avgSize } = useMemo(() => prStats(sl), [sl]);

  let prs = sl.prs.slice();
  
  // Filtering
  if (state.ui.prF === 'open') prs = prs.filter(p => p.state === 'open');
  else if (state.ui.prF === 'merged') prs = prs.filter(p => p.state === 'merged');
  else if (state.ui.prF === 'closed') prs = prs.filter(p => p.state === 'closed');
  else if (state.ui.prF === 'mine') prs = prs.filter(p => p.pending.indexOf(state.ui.dev) >= 0); // "Needs my review"

  if (state.ui.prQ) {
    const q = state.ui.prQ.toLowerCase();
    prs = prs.filter(p => p.title.toLowerCase().includes(q) || p.repo.toLowerCase().includes(q) || ('#' + p.num).includes(q));
  }

  // Sorting
  const sortDir = state.ui.prDir || -1;
  if (state.ui.prSort === 'created') prs.sort((a, b) => (a.created - b.created) * sortDir);
  else if (state.ui.prSort === 'size') prs.sort((a, b) => ((a.add + a.del) - (b.add + b.del)) * sortDir);
  else if (state.ui.prSort === 'repo') prs.sort((a, b) => a.repo.localeCompare(b.repo) * sortDir);

  const paginated = prs.slice(0, state.ui.prN || 10);

  const toggleSort = (key) => {
    if (state.ui.prSort === key) updateUI('prDir', sortDir * -1);
    else {
      updateUI('prSort', key);
      updateUI('prDir', -1);
    }
  };

  const th = (key, label) => (
    <th 
      className="p-[12px_16px] text-left text-[12px] font-medium text-ink-3 uppercase tracking-wider cursor-pointer hover:bg-surface-2 transition-colors select-none first:rounded-tl-custom last:rounded-tr-custom" 
      onClick={() => toggleSort(key)}
    >
      <div className="flex items-center gap-1.5">
        {label}
        {state.ui.prSort === key && <Icon name={sortDir === -1 ? 'down' : 'up'} size="tiny" />}
      </div>
    </th>
  );

  return (
    <>
      <PageHeader title="Pull Requests" right={<Filters />} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCard(total, 'Total PRs')}
        {statCard(Math.round(mergeRate * 100) + '%', 'Merge rate', 'border-c-pr text-c-pr bg-[color-mix(in_srgb,var(--color-c-pr)_3%,var(--color-surface))]')}
        {statCard(avgMerge.toFixed(1) + 'h', 'Avg time to merge')}
        {statCard(Math.round(avgSize), 'Avg lines changed')}
      </div>

      <Panel className="p-0 overflow-hidden">
        <div className="p-4 border-b border-line flex flex-wrap gap-3 items-center bg-surface-2">
          <Input 
            placeholder="Search PRs..." 
            className="w-[280px] bg-surface" 
            value={state.ui.prQ} 
            onChange={e => updateUI('prQ', e.target.value)} 
          />
          <Select 
            value={state.ui.prF} 
            onChange={e => updateUI('prF', e.target.value)}
            className="bg-surface"
            options={[
              { value: 'all', label: 'State: All' },
              { value: 'open', label: 'State: Open' },
              { value: 'merged', label: 'State: Merged' },
              { value: 'closed', label: 'State: Closed' },
              { value: 'mine', label: 'Needs my review' }
            ]}
          />
          <div className="ml-auto text-[13px] text-ink-2 font-medium">
            Showing {paginated.length} of {prs.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface border-b border-line">
              <tr>
                <th className="w-10"></th>
                {th('title', 'Pull Request')}
                {th('repo', 'Repository')}
                {th('created', 'Created')}
                {th('size', 'Size')}
                <th className="p-[12px_16px] text-left text-[12px] font-medium text-ink-3 uppercase tracking-wider">Reviewers</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length ? paginated.map(p => (
                <tr key={p.id} className="border-b border-line last:border-0 hover:bg-surface-2/50 transition-colors group">
                  <td className="p-[16px_0_16px_16px] w-10 text-center">
                    <Icon name="pr" className={p.state === 'merged' ? 'text-c-pr' : p.state === 'closed' ? 'text-bad' : 'text-good'} />
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1.5">
                      <a href="#" className="font-semibold text-[15px] hover:text-accent transition-colors line-clamp-1">{p.title}</a>
                      <div className="flex items-center gap-2 text-[13px] text-ink-3">
                        <span className="font-medium">#{p.num}</span>
                        <span>by</span>
                        <div className="flex items-center gap-1.5 text-ink-2 font-medium">
                          <Avatar id={p.author} size="sm" />
                          {U(p.author).first}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className="font-mono text-[11.5px]">{p.repo}</Badge>
                  </td>
                  <td className="p-4 text-[13.5px] text-ink-2 whitespace-nowrap">
                    {ago(p.created)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-[13px] font-medium whitespace-nowrap num">
                      <span className="text-good">+{p.add}</span>
                      <span className="text-bad">-{p.del}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-[-6px]">
                      {p.pending.map((uid, i) => (
                        <div key={i} className="relative -ml-1.5 first:ml-0 rounded-full border-2 border-surface">
                          <Avatar id={uid} size="sm" />
                        </div>
                      ))}
                      {p.pending.length === 0 && <span className="text-ink-3 text-[13px] italic">None</span>}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6">
                    <EmptyState title="No pull requests found" desc="Try adjusting your filters or date range." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {prs.length > (state.ui.prN || 10) && (
          <div className="p-4 border-t border-line text-center">
            <Button onClick={() => updateUI('prN', (state.ui.prN || 10) + 10)}>Load More</Button>
          </div>
        )}
      </Panel>
    </>
  );
}
