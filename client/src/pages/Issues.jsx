import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { sliceState, issStats } from '../utils/helpers';
import { U, ago } from '../utils/mockData';
import { PageHeader, Filters, Panel, EmptyState } from '../components/layout/Panel';
import { Badge, Input, Select, Avatar, Button } from '../components/common/UI';
import { Icon } from '../components/common/Icons';

function statCard(v, l, c = '') {
  return (
    <div className={`p-4 rounded-custom border border-line bg-surface flex flex-col justify-center items-center text-center ${c}`}>
      <div className="text-[32px] font-bold leading-none num">{v}</div>
      <div className="text-ink-2 text-[13px] mt-1.5">{l}</div>
    </div>
  );
}

export default function Issues() {
  const { state, updateUI } = useAppContext();
  const sl = sliceState(null, state);
  
  const { opened, closed, open, avgRes } = useMemo(() => issStats(sl, state), [sl, state]);

  let issues = sl.issClosed.slice();
  
  if (state.ui.isQ) {
    const q = state.ui.isQ.toLowerCase();
    issues = issues.filter(i => i.title.toLowerCase().includes(q) || i.repo.toLowerCase().includes(q) || ('#' + i.num).includes(q));
  }

  if (state.ui.isF !== 'all') {
    issues = issues.filter(i => i.label === state.ui.isF);
  }

  // Sorting
  issues.sort((a, b) => b.closed - a.closed);

  const paginated = issues.slice(0, state.ui.isN || 10);
  
  const prioColor = (p) => p === 'Critical' ? 'text-bad bg-bad/10 border-bad/30' : p === 'High' ? 'text-warn bg-warn/10 border-warn/30' : 'text-ink-2 bg-surface-2 border-line';

  return (
    <>
      <PageHeader title="Issues Resolved" right={<Filters />} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCard(closed, 'Issues closed', 'border-c-issue text-c-issue bg-[color-mix(in_srgb,var(--color-c-issue)_3%,var(--color-surface))]')}
        {statCard(opened, 'Issues opened')}
        {statCard(open, 'Currently open')}
        {statCard(avgRes.toFixed(1) + 'h', 'Avg resolution time')}
      </div>

      <Panel className="p-0 overflow-hidden">
        <div className="p-4 border-b border-line flex flex-wrap gap-3 items-center bg-surface-2">
          <Input 
            placeholder="Search resolved issues..." 
            className="w-[280px] bg-surface" 
            value={state.ui.isQ} 
            onChange={e => updateUI('isQ', e.target.value)} 
          />
          <Select 
            value={state.ui.isF} 
            onChange={e => updateUI('isF', e.target.value)}
            className="bg-surface capitalize"
            options={[
              { value: 'all', label: 'Label: All' },
              { value: 'bug', label: 'bug' },
              { value: 'feature', label: 'feature' },
              { value: 'enhancement', label: 'enhancement' },
              { value: 'performance', label: 'performance' },
              { value: 'security', label: 'security' }
            ]}
          />
          <div className="ml-auto text-[13px] text-ink-2 font-medium">
            Showing {paginated.length} of {issues.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface border-b border-line">
              <tr>
                <th className="w-10"></th>
                <th className="p-[12px_16px] text-[12px] font-medium text-ink-3 uppercase tracking-wider">Issue</th>
                <th className="p-[12px_16px] text-[12px] font-medium text-ink-3 uppercase tracking-wider">Repository</th>
                <th className="p-[12px_16px] text-[12px] font-medium text-ink-3 uppercase tracking-wider">Priority</th>
                <th className="p-[12px_16px] text-[12px] font-medium text-ink-3 uppercase tracking-wider">Resolved By</th>
                <th className="p-[12px_16px] text-[12px] font-medium text-ink-3 uppercase tracking-wider">Closed At</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length ? paginated.map(i => (
                <tr key={i.id} className="border-b border-line last:border-0 hover:bg-surface-2/50 transition-colors">
                  <td className="p-[16px_0_16px_16px] w-10 text-center">
                    <Icon name="check" className="text-c-issue" />
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1.5">
                      <a href="#" className="font-semibold text-[15px] hover:text-accent transition-colors line-clamp-1">{i.title}</a>
                      <div className="flex items-center gap-2 text-[13px] text-ink-3">
                        <span className="font-medium">#{i.num}</span>
                        <Badge className="font-normal capitalize border-line-2">{i.label}</Badge>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className="font-mono text-[11.5px]">{i.repo}</Badge>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center text-[12px] font-medium px-2 py-0.5 rounded-full border ${prioColor(i.priority)}`}>{i.priority}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-medium text-[13.5px]">
                      <Avatar id={i.assignee} size="sm" />
                      {U(i.assignee).first}
                    </div>
                  </td>
                  <td className="p-4 text-[13.5px] text-ink-2 whitespace-nowrap">
                    {ago(i.closed)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6">
                    <EmptyState title="No issues found" desc="Try adjusting your filters or date range." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {issues.length > (state.ui.isN || 10) && (
          <div className="p-4 border-t border-line text-center">
            <Button onClick={() => updateUI('isN', (state.ui.isN || 10) + 10)}>Load More</Button>
          </div>
        )}
      </Panel>
    </>
  );
}
