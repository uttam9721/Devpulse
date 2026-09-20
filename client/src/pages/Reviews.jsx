import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { sliceState, revStats } from '../utils/helpers';
import { U, ago } from '../utils/mockData';
import { PageHeader, Filters, Panel, EmptyState } from '../components/layout/Panel';
import { Badge, Avatar, Button } from '../components/common/UI';
import { Icon } from '../components/common/Icons';

function statCard(v, l, c = '') {
  return (
    <div className={`p-4 rounded-custom border border-line bg-surface flex flex-col justify-center items-center text-center ${c}`}>
      <div className="text-[32px] font-bold leading-none num">{v}</div>
      <div className="text-ink-2 text-[13px] mt-1.5">{l}</div>
    </div>
  );
}

export default function Reviews() {
  const { state, updateUI } = useAppContext();
  const sl = sliceState(null, state);
  
  const { n, comments, prs, resp } = useMemo(() => revStats(sl), [sl]);

  let revs = sl.reviews.slice();
  
  // Sorting
  revs.sort((a, b) => b.at - a.at);

  const paginated = revs.slice(0, state.ui.rvN || 10);

  return (
    <>
      <PageHeader title="Code Reviews" right={<Filters />} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCard(n, 'Reviews given')}
        {statCard(prs, 'Unique PRs reviewed')}
        {statCard(comments, 'Total comments')}
        {statCard(resp.toFixed(1) + 'h', 'Avg response time', 'border-c-review text-c-review bg-[color-mix(in_srgb,var(--color-c-review)_3%,var(--color-surface))]')}
      </div>

      <Panel className="p-0 overflow-hidden">
        <div className="p-4 border-b border-line bg-surface-2 flex items-center justify-between">
          <h3 className="font-semibold text-[15px]">Recent Reviews</h3>
          <div className="text-[13px] text-ink-2 font-medium">
            Showing {paginated.length} of {revs.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface border-b border-line">
              <tr>
                <th className="w-10"></th>
                <th className="p-[12px_16px] text-[12px] font-medium text-ink-3 uppercase tracking-wider">Pull Request</th>
                <th className="p-[12px_16px] text-[12px] font-medium text-ink-3 uppercase tracking-wider">Reviewer</th>
                <th className="p-[12px_16px] text-[12px] font-medium text-ink-3 uppercase tracking-wider">State</th>
                <th className="p-[12px_16px] text-[12px] font-medium text-ink-3 uppercase tracking-wider">Response Time</th>
                <th className="p-[12px_16px] text-[12px] font-medium text-ink-3 uppercase tracking-wider">Reviewed At</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length ? paginated.map((r, idx) => (
                <tr key={idx} className="border-b border-line last:border-0 hover:bg-surface-2/50 transition-colors">
                  <td className="p-[16px_0_16px_16px] w-10 text-center">
                    <Icon name="eye" className={r.state === 'approved' ? 'text-good' : r.state === 'changes' ? 'text-bad' : 'text-warn'} />
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1.5">
                      <a href="#" className="font-semibold text-[15px] hover:text-accent transition-colors line-clamp-1">{r.title}</a>
                      <div className="flex items-center gap-2 text-[13px] text-ink-3">
                        <span className="font-medium">#{r.num}</span>
                        <span>in <span className="font-medium">{r.repo}</span></span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-medium text-[13.5px]">
                      <Avatar id={r.reviewer} size="sm" />
                      {U(r.reviewer).first}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={r.state}>{r.state}</Badge>
                    {r.comments > 0 && <span className="ml-2 text-ink-3 text-[12px]">{r.comments} comments</span>}
                  </td>
                  <td className="p-4 text-[13.5px] num">
                    {r.resp.toFixed(1)}h
                  </td>
                  <td className="p-4 text-[13.5px] text-ink-2 whitespace-nowrap">
                    {ago(r.at)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6">
                    <EmptyState title="No reviews found" desc="Try adjusting your filters or date range." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {revs.length > (state.ui.rvN || 10) && (
          <div className="p-4 border-t border-line text-center">
            <Button onClick={() => updateUI('rvN', (state.ui.rvN || 10) + 10)}>Load More</Button>
          </div>
        )}
      </Panel>
    </>
  );
}
