import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { sliceState, bucketize, streakInfo, repoShare, themesOf } from '../utils/helpers';
import { USERS, REPOS, REPO_COL, ago } from '../utils/mockData';
import { PageHeader, Filters, Panel, EmptyState } from '../components/layout/Panel';
import { Avatar, Badge } from '../components/common/UI';
import { Sparkline, DonutChart } from '../components/charts/Charts';
import { Icon } from '../components/common/Icons';

export default function DeveloperProfile() {
  const { id } = useParams();
  const { state } = useAppContext();
  
  const dev = USERS.find(u => u.id === id);
  if (!dev) return <div className="p-8">Developer not found.</div>;

  const sl = sliceState({ user: dev.id, all: true }, state);
  const B = bucketize(sl);
  const st = streakInfo(dev.id, state);

  const act = sl.commits.length + sl.prs.length + sl.reviews.length + sl.issClosed.length;

  const th = themesOf(sl.commits, 5);
  const rs = repoShare(sl.commits).slice(0, 5);

  const FI = { commits: ['commit', '--color-c-commit'], prs: ['pr', '--color-c-pr'], reviews: ['eye', '--color-c-review'], issues: ['issue', '--color-c-issue'] };

  const ev = [];
  sl.commits.slice().sort((a, b) => b.t - a.t).slice(0, 10).forEach(c => ev.push({ t: c.t, k: 'commits', h: <>pushed "{c.msg}" to <span className="font-medium text-ink-2">{c.repo}</span></> }));
  sl.prs.forEach(p => ev.push({ t: p.created, k: 'prs', h: <>opened PR #{p.num} in <span className="font-medium text-ink-2">{p.repo}</span></> }));
  sl.reviews.forEach(r => ev.push({ t: r.at, k: 'reviews', h: <>{r.state === 'approved' ? 'approved' : r.state === 'changes' ? 'requested changes on' : 'commented on'} PR #{r.num} in <span className="font-medium text-ink-2">{r.repo}</span></> }));
  sl.issClosed.forEach(i => ev.push({ t: i.closed, k: 'issues', h: <>closed issue #{i.num}</> }));
  const feed = ev.sort((a, b) => b.t - a.t).slice(0, 10);

  return (
    <>
      <div className="flex items-end justify-between gap-4 flex-wrap my-[18px] mb-[20px]">
        <div className="flex items-center gap-4">
          <Avatar id={dev.id} size="lg" />
          <div>
            <h1 className="text-[clamp(26px,4vw,34px)] font-extrabold tracking-[-0.03em] leading-tight">{dev.name}</h1>
            <p className="text-ink-2">{dev.role}</p>
          </div>
        </div>
        <Filters scope={false} repo={false} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Panel className="flex flex-col items-center justify-center text-center p-4">
          <div className="text-[32px] font-bold num">{sl.commits.length}</div>
          <div className="text-ink-2 text-[13px] flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-c-commit"></i> Commits</div>
        </Panel>
        <Panel className="flex flex-col items-center justify-center text-center p-4">
          <div className="text-[32px] font-bold num">{sl.prs.length}</div>
          <div className="text-ink-2 text-[13px] flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-c-pr"></i> Pull Requests</div>
        </Panel>
        <Panel className="flex flex-col items-center justify-center text-center p-4">
          <div className="text-[32px] font-bold num">{sl.reviews.length}</div>
          <div className="text-ink-2 text-[13px] flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-c-review"></i> Reviews</div>
        </Panel>
        <Panel className="flex flex-col items-center justify-center text-center p-4">
          <div className="text-[32px] font-bold num">{st.cur} <span className="text-xl">days</span></div>
          <div className="text-ink-2 text-[13px]">Current Streak</div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Panel title="Top repositories">
          {rs.length ? (
            <DonutChart items={rs.map((x, i) => ({ l: x.id, v: x.c, c: REPOS.find(r => r.id === x.id)?.col || '#ccc' }))} center={[sl.commits.length, 'commits']} />
          ) : <EmptyState title="No repositories" />}
        </Panel>
        <Panel title="Top themes">
          {th.length ? (
            <DonutChart items={th.map((x, i) => ({ l: x.name, v: x.count, c: REPO_COL[i] }))} center={[sl.commits.length, 'commits']} />
          ) : <EmptyState title="No themes" />}
        </Panel>
      </div>

      <Panel title={`Recent activity in last ${state.range} days`}>
        {feed.length ? (
          <ul className="list-none p-0 m-0">
            {feed.map((e, i) => (
              <li key={i} className="flex gap-3 py-[11px] border-b border-line last:border-0 text-[14px] items-start">
                <span className="w-[28px] h-[28px] rounded-full grid place-items-center shrink-0 text-white" style={{ background: `var(${FI[e.k][1]})` }}>
                  <Icon name={FI[e.k][0]} size="tiny" />
                </span>
                <span><b>{dev.first}</b> {e.h}</span>
                <span className="text-ink-3 text-[12.5px] whitespace-nowrap ml-auto pl-2">{ago(e.t)}</span>
              </li>
            ))}
          </ul>
        ) : <EmptyState title="No activity" />}
      </Panel>
    </>
  );
}
