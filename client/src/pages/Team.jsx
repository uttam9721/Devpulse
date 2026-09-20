import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { sliceState, bucketize } from '../utils/helpers';
import { USERS } from '../utils/mockData';
import { PageHeader, Filters, Panel } from '../components/layout/Panel';
import { Avatar, Badge } from '../components/common/UI';
import { Sparkline } from '../components/charts/Charts';
import { Icon } from '../components/common/Icons';

export default function Team() {
  const { state } = useAppContext();
  
  return (
    <>
      <PageHeader title="Team Overview" right={<Filters scope={false} repo={false} />} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {USERS.map(u => {
          const sl = sliceState({ user: u.id, all: true }, state);
          const b = bucketize(sl);
          const act = sl.commits.length + sl.prs.length + sl.reviews.length + sl.issClosed.length;
          
          return (
            <Link key={u.id} to={`/developers/${u.id}`} className="block group">
              <Panel className="hover:border-ink transition-colors duration-200 flex flex-col h-full">
                <div className="flex items-start gap-3 mb-4">
                  <Avatar id={u.id} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[16px] group-hover:text-accent transition-colors truncate">{u.name}</div>
                    <div className="text-[13px] text-ink-2 truncate">{u.role}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-[13px] text-ink-3 mb-4">
                  <div className="flex items-center gap-1.5"><Icon name="commit" size="tiny" /> {sl.commits.length} commits</div>
                  <div className="flex items-center gap-1.5"><Icon name="pr" size="tiny" /> {sl.prs.length} PRs</div>
                </div>
                
                <div className="pt-3 border-t border-line mt-auto">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[11px] font-medium text-ink-3 uppercase tracking-wider mb-1">Activity ({sl.days}d)</div>
                      <div className="text-[20px] font-bold num">{act}</div>
                    </div>
                    <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                      <Sparkline data={b.total} color={u.color} width={100} height={32} />
                    </div>
                  </div>
                </div>
              </Panel>
            </Link>
          );
        })}
      </div>
    </>
  );
}
