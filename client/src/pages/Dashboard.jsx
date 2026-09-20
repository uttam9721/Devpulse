import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { sliceState, bucketize, tot, repoShare, themesOf, streakInfo, prStats } from '../utils/helpers';
import { ME, U, ago, REPOS, REPO_COL, DB, fmtDur, fmtN, pct } from '../utils/mockData';
import { PageHeader, Filters, Panel, EmptyState } from '../components/layout/Panel';
import { KPI, DeltaChip } from '../components/common/KPI';
import { Sparkline, LineChart, VerticalBars, DonutChart } from '../components/charts/Charts';
import { Icon, GhIcon } from '../components/common/Icons';
import { Badge, Button } from '../components/common/UI';
import { Link } from 'react-router-dom';

const FI = { commits: ['commit', '--color-c-commit'], prs: ['pr', '--color-c-pr'], reviews: ['eye', '--color-c-review'], issues: ['issue', '--color-c-issue'] };
const who = id => id === ME ? 'You' : U(id).first;
const SER = [['commits', 'Commits', 'var(--color-c-commit)'], ['prs', 'Pull requests', 'var(--color-c-pr)'], ['reviews', 'Reviews', 'var(--color-c-review)'], ['issues', 'Issues closed', 'var(--color-c-issue)']];

function feedItems(sl, n) {
  const ev = [];
  sl.commits.slice().sort((a, b) => b.t - a.t).slice(0, 4).forEach(c => ev.push({ t: c.t, k: 'commits', h: <><b>{who(c.user)}</b> pushed "{c.msg}" to <span className="font-medium text-ink-2">{c.repo}</span></> }));
  sl.prs.forEach(p => ev.push({ t: p.created, k: 'prs', h: <><b>{who(p.author)}</b> opened PR #{p.num} in <span className="font-medium text-ink-2">{p.repo}</span>: {p.title}</> }));
  sl.mergedPrs.forEach(p => ev.push({ t: p.mergedAt, k: 'prs', h: <>PR #{p.num} "{p.title}" by <b>{who(p.author)}</b> was merged in <span className="font-medium text-ink-2">{p.repo}</span></> }));
  sl.reviews.forEach(r => ev.push({ t: r.at, k: 'reviews', h: <><b>{who(r.reviewer)}</b> {r.state === 'approved' ? 'approved' : r.state === 'changes' ? 'requested changes on' : 'commented on'} PR #{r.num} in <span className="font-medium text-ink-2">{r.repo}</span></> }));
  sl.issClosed.forEach(i => ev.push({ t: i.closed, k: 'issues', h: <><b>{who(i.assignee)}</b> closed issue #{i.num}: {i.title}</> }));
  return ev.sort((a, b) => b.t - a.t).slice(0, n);
}

function attention(tracked) {
  const it = [];
  const ok = r => tracked.has(r);
  const pend = DB.prs.filter(p => p.state === 'open' && p.pending.indexOf(ME) >= 0 && ok(p.repo));
  if (pend.length) it.push({ i: 'eye', t: `${pend.length} pull request${pend.length === 1 ? '' : 's'} waiting for your review`, s: pend.slice(0, 2).map(p => `#${p.num} in ${p.repo}`).join(', '), to: '/pull-requests' });
  const mine = DB.prs.filter(p => p.author === ME && p.state === 'open' && ok(p.repo));
  // Not replicating RV state deeply here for demo brevity, just checking stale
  const stale = mine.filter(p => (Date.now() - p.created) / 864e5 >= 3);
  if (stale.length) it.push({ i: 'clock', t: `${stale.length} PR${stale.length === 1 ? '' : 's'} open for 3+ days`, s: stale.slice(0, 2).map(p => `#${p.num} in ${p.repo}`).join(', '), to: '/pull-requests' });
  const hi = DB.issues.filter(i => !i.closed && i.assignee === ME && (i.priority === 'High' || i.priority === 'Critical') && ok(i.repo));
  if (hi.length) it.push({ i: 'issue', t: `${hi.length} high-priority issue${hi.length === 1 ? '' : 's'} assigned to you`, s: hi.slice(0, 2).map(i => i.title).join(', '), to: '/issues' });
  return it;
}

export default function Dashboard() {
  const { state, updateUI } = useAppContext();
  const sl = sliceState(null, state);
  const pv = sliceState({ k: 1 }, state);
  const B = bucketize(sl);
  const d = sl.days;
  const me = !!sl.user;

  const ap = pct(tot(sl), tot(pv));
  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  const per = `${B.labels[0]} – ${B.labels[B.labels.length - 1]}`;

  const K = [
    ['Commits', 'c-commit', sl.commits.length, pv.commits.length, B.commits],
    ['Pull requests', 'c-pr', sl.prs.length, pv.prs.length, B.prs],
    ['Code reviews', 'c-review', sl.reviews.length, pv.reviews.length, B.reviews],
    ['Issues closed', 'c-issue', sl.issClosed.length, pv.issClosed.length, B.issues]
  ];

  const wd = Array(7).fill(0);
  sl.commits.forEach(c => wd[new Date(c.t).getDay()]++);
  sl.prs.forEach(p => wd[new Date(p.created).getDay()]++);
  sl.reviews.forEach(r => wd[new Date(r.at).getDay()]++);
  sl.issClosed.forEach(i => wd[new Date(i.closed).getDay()]++);
  const mxd = Math.max(...wd);
  const nm = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const wbars = [1, 2, 3, 4, 5, 6, 0].map(k => ({ l: nm[k], v: wd[k], hi: wd[k] === mxd && mxd > 0 }));

  let dn = null;
  if (!state.repo) {
    const rs = repoShare(sl.commits).slice(0, 5);
    if (rs.length) {
      dn = <DonutChart items={rs.map(x => ({ l: x.id, v: x.c, c: REPOS.find(r => r.id === x.id)?.col || '#ccc' }))} center={[sl.commits.length, 'commits']} />;
    } else dn = <EmptyState title="No commits yet" desc="Nothing in this range." />;
  } else {
    const th = themesOf(sl.commits, 5);
    if (th.length) {
      dn = <DonutChart items={th.map((x, i) => ({ l: x.name, v: x.count, c: REPO_COL[i] }))} center={[sl.commits.length, 'commits']} />;
    } else dn = <EmptyState title="No commits yet" desc="Nothing in this range." />;
  }

  const st = streakInfo(me ? ME : null, state);
  const feed = feedItems(sl, 8);
  const att = attention(new Set(state.tracked));

  const toggleHide = (key) => {
    const hidden = [...state.ui.hide];
    if (hidden.includes(key)) hidden.splice(hidden.indexOf(key), 1);
    else hidden.push(key);
    updateUI('hide', hidden);
  };

  return (
    <>
      <PageHeader 
        title={`${greet}, ${U(ME).first} 👋`} 
        sub={`Engineering activity for ${per}`} 
        right={<Filters />} 
      />

      <div className="grid gap-[1px] bg-line border border-line rounded-custom overflow-hidden grid-cols-2 md:grid-cols-4">
        {K.map((k, i) => (
          <KPI
            key={i}
            label={k[0]}
            color={k[1]}
            val={k[2]}
            foot={<>{<DeltaChip p={pct(k[2], k[3])} />}<span className="text-ink-3 text-[12px] ml-1">vs prev {d}d</span></>}
            extra={<Sparkline data={k[4]} color={`var(--color-${k[1]})`} />}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-4 mt-4">
        <Panel
          title="Activity pulse"
          sub={`<span class="inline-flex items-center gap-[3px] text-[12px] font-medium px-[7px] py-[2px] rounded-full ${ap >= 0 ? 'text-good bg-good/12' : 'text-bad bg-bad/11'}"><svg class="w-[13px] h-[13px] stroke-current fill-none stroke-[2.2px]" viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>${Math.abs(ap)}% vs previous ${d} days</span>`}
          right={
            <div className="flex flex-wrap gap-1.5">
              {SER.map(s => (
                <button
                  key={s[0]}
                  onClick={() => toggleHide(s[0])}
                  className={`inline-flex items-center gap-[7px] h-[28px] px-2.5 rounded-full border border-line-2 text-[12.5px] font-medium text-ink-2 ${state.ui.hide.includes(s[0]) ? 'opacity-45 line-through' : ''}`}
                >
                  <i className="w-2 h-2 rounded-full" style={{ background: s[2] }}></i>
                  {s[1]}
                </button>
              ))}
            </div>
          }
        >
          <LineChart
            labels={B.labels}
            long={B.long}
            height={250}
            series={SER.map(s => ({
              name: s[1],
              c: s[2],
              data: B[s[0]],
              hidden: state.ui.hide.includes(s[0])
            }))}
          />
        </Panel>

        <section className="bg-[linear-gradient(160deg,color-mix(in_srgb,var(--color-accent)_7%,var(--color-surface)),var(--color-surface)_55%)] border border-[color-mix(in_srgb,var(--color-accent)_25%,var(--color-line))] rounded-custom p-[18px] min-w-0">
          <div className="flex items-center gap-[10px] flex-wrap mb-[14px]">
            <h3 className="text-[17px] flex items-center gap-2"><Icon name="spark" /> Ask DevPulse</h3>
            <div className="ml-auto">
              <Button size="sm" onClick={() => {
                updateUI('insBusy', true);
                setTimeout(() => {
                  updateUI('insBusy', false);
                  updateUI('insVar', state.ui.insVar + 1);
                }, 700);
              }}>
                <Icon name="sync" size="tiny" /> Regenerate
              </Button>
            </div>
          </div>
          <div className="text-[14.5px] leading-[1.6]">
            {state.ui.insBusy ? (
              <div className="inline-flex gap-1 py-1.5 opacity-40">
                <i className="w-[7px] h-[7px] rounded-full bg-ink-3"></i>
                <i className="w-[7px] h-[7px] rounded-full bg-ink-3"></i>
                <i className="w-[7px] h-[7px] rounded-full bg-ink-3"></i>
              </div>
            ) : (
              <div>
                <p>This week you worked mainly on:</p>
                <ol className="list-decimal pl-5 my-1.5">
                  <li>Payment APIs <span className="text-ink-3">(12 commits)</span></li>
                  <li>Webhook reliability <span className="text-ink-3">(5 commits)</span></li>
                </ol>
                <p>You merged <b>4</b> PRs and gave <b>12</b> reviews.</p>
                <p>The largest activity was in <b>payment-service</b>.</p>
              </div>
            )}
          </div>
          <div className="mt-[14px] flex gap-2 flex-wrap">
            <Button size="sm" as={Link} to="/ai">Ask a follow-up</Button>
            <Button size="sm" as={Link} to="/reports">Open report</Button>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Panel title="Most active days">
          <VerticalBars items={wbars} height={150} />
        </Panel>
        <Panel title={state.repo ? 'Focus areas' : 'Where effort went'}>
          {dn}
        </Panel>
        <Panel title="Consistency">
          <div className="flex items-center gap-[14px]">
            <div className="w-[46px] h-[46px] rounded-[14px] grid place-items-center bg-[color-mix(in_srgb,var(--color-c-issue)_16%,transparent)] text-c-issue">
              <Icon name="flame" size="big" className="fill-current stroke-none" />
            </div>
            <div>
              <div className="text-[30px] font-bold leading-none num">{st.cur} {st.cur === 1 ? 'day' : 'days'}</div>
              <div className="text-ink-2 text-[13px]">Current streak · best {st.best}</div>
            </div>
          </div>
          <div className="flex gap-[5px] mt-[14px]">
            {st.last14.map((x, i) => (
              <i key={i} className={`flex-1 h-[26px] rounded-[6px] border ${x ? 'bg-c-review border-c-review' : 'bg-surface-2 border-line'}`}></i>
            ))}
          </div>
          <p className="text-ink-3 text-[13px] mt-[10px]">Days with a commit, PR, review or closed issue.</p>
        </Panel>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Panel title="Recent activity">
          {feed.length ? (
            <ul className="list-none p-0 m-0">
              {feed.map((e, i) => (
                <li key={i} className="flex gap-3 py-[11px] border-b border-line last:border-0 text-[14px] items-start">
                  <span className="w-[28px] h-[28px] rounded-full grid place-items-center shrink-0 text-white" style={{ background: `var(${FI[e.k][1]})` }}>
                    <Icon name={FI[e.k][0]} size="tiny" />
                  </span>
                  <span>{e.h}</span>
                  <span className="text-ink-3 text-[12.5px] whitespace-nowrap ml-auto pl-2">{ago(e.t)}</span>
                </li>
              ))}
            </ul>
          ) : <EmptyState title="No activity in this range" desc="Try a longer range or sync now." />}
        </Panel>

        <Panel title="Needs your attention">
          {att.length ? att.map((a, i) => (
            <Link key={i} to={a.to} className="flex gap-3 items-start py-[12px] border-b border-line last:border-0 text-[14px] w-full text-left group">
              <span className="w-[32px] h-[32px] rounded-[9px] grid place-items-center bg-surface-2 text-ink-2 shrink-0 group-hover:bg-ink group-hover:text-bg transition-colors">
                <Icon name={a.i} />
              </span>
              <span>
                <b className="font-medium">{a.t}</b><br />
                <span className="text-ink-2 text-[13px]">{a.s}</span>
              </span>
            </Link>
          )) : <EmptyState title="You are all caught up" desc="No reviews waiting and no stuck PRs." />}
        </Panel>
      </div>
    </>
  );
}
