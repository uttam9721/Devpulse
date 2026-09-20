import { DB, dayIdx, dayStart, fmtW, fmtD, fmtDW, HOUR } from './mockData';

const sum = a => a.reduce((x, y) => x + y, 0);
const avg = a => a.length ? sum(a) / a.length : 0;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function sliceState(o, state) {
  o = o || {};
  const days = o.days || state.range, k = o.k || 0;
  const lo = o.lo != null ? o.lo : k * days, hi = o.hi != null ? o.hi : (k + 1) * days;
  const scope = o.scope || state.scope;
  const user = o.user !== undefined ? o.user : (scope === 'me' ? 'uttam' : null);
  const repo = o.repo !== undefined ? o.repo : state.repo;
  const tracked = new Set(state.tracked);
  const inR = t => { const d = dayIdx(t); return d >= lo && d < hi };
  const okR = r => o.all ? true : (repo ? r === repo : tracked.has(r));
  
  return {
    lo, hi, days: hi - lo, user, repo, inR, okR,
    commits: DB.commits.filter(c => inR(c.t) && okR(c.repo) && (!user || c.user === user)),
    prs: DB.prs.filter(p => inR(p.created) && okR(p.repo) && (!user || p.author === user)),
    mergedPrs: DB.prs.filter(p => p.mergedAt && inR(p.mergedAt) && okR(p.repo) && (!user || p.author === user)),
    reviews: DB.reviews.filter(r => inR(r.at) && okR(r.repo) && (!user || r.reviewer === user)),
    issOpened: DB.issues.filter(i => inR(i.created) && okR(i.repo) && (!user || i.author === user)),
    issClosed: DB.issues.filter(i => i.closed && inR(i.closed) && okR(i.repo) && (!user || i.assignee === user))
  };
}

export const tot = s => s.commits.length + s.prs.length + s.reviews.length + s.issClosed.length;

export function bucketize(sl) {
  const days = sl.hi - sl.lo, step = days > 35 ? 7 : 1, nb = Math.ceil(days / step);
  const mk = () => Array(nb).fill(0);
  const o = { commits: mk(), prs: mk(), merged: mk(), reviews: mk(), issues: mk(), opened: mk(), labels: [], long: [], nb };
  const idx = t => clamp(nb - 1 - Math.floor((dayIdx(t) - sl.lo) / step), 0, nb - 1);
  
  sl.commits.forEach(c => o.commits[idx(c.t)]++);
  sl.prs.forEach(p => o.prs[idx(p.created)]++);
  sl.mergedPrs.forEach(p => o.merged[idx(p.mergedAt)]++);
  sl.reviews.forEach(r => o.reviews[idx(r.at)]++);
  sl.issClosed.forEach(i => o.issues[idx(i.closed)]++);
  sl.issOpened.forEach(i => o.opened[idx(i.created)]++);
  
  for (let b = 0; b < nb; b++) {
    const dEnd = sl.lo + (nb - 1 - b) * step, dStart = Math.min(sl.hi - 1, dEnd + step - 1);
    o.labels.push(step === 1 ? (days <= 7 ? fmtW(dayStart(dEnd)) : fmtD(dayStart(dEnd))) : fmtD(dayStart(dStart)));
    o.long.push(step === 1 ? fmtDW(dayStart(dEnd)) : fmtD(dayStart(dStart)) + ' – ' + fmtD(dayStart(dEnd)));
  }
  o.total = o.commits.map((v, i) => v + o.prs[i] + o.reviews[i] + o.issues[i]);
  return o;
}

export function prStats(sl) {
  const prs = sl.prs, merged = prs.filter(p => p.state === 'merged'), open = prs.filter(p => p.state === 'open'), closed = prs.filter(p => p.state === 'closed');
  const rev = prs.filter(p => p.firstReview).map(p => Math.max(.05, (p.firstReview - p.created) / HOUR));
  const mer = merged.map(p => (p.mergedAt - p.created) / HOUR);
  return { total: prs.length, merged: merged.length, open: open.length, closed: closed.length, avgReview: avg(rev), avgMerge: avg(mer), mergeRate: (merged.length + closed.length) ? merged.length / (merged.length + closed.length) : 0, avgSize: avg(prs.map(p => p.add + p.del)), mergeList: mer };
}

export function revStats(sl) {
  return { n: sl.reviews.length, comments: sum(sl.reviews.map(r => r.comments)), prs: new Set(sl.reviews.map(r => r.pr)).size, resp: avg(sl.reviews.map(r => r.resp)) };
}

export function issStats(sl, state) {
  const closed = sl.issClosed;
  const res = closed.map(i => (i.closed - i.created) / HOUR);
  const open = DB.issues.filter(i => !i.closed && sl.okR(i.repo) && (!sl.user || i.assignee === sl.user)).length;
  return { opened: sl.issOpened.length, closed: closed.length, open, avgRes: avg(res) };
}

export function activeDays(uid, state) {
  const set = new Set(), add = t => set.add(dayIdx(t));
  const tracked = new Set(state.tracked);
  DB.commits.forEach(c => { if ((!uid || c.user === uid) && tracked.has(c.repo)) add(c.t) });
  DB.prs.forEach(p => { if ((!uid || p.author === uid) && tracked.has(p.repo)) add(p.created) });
  DB.reviews.forEach(r => { if ((!uid || r.reviewer === uid) && tracked.has(r.repo)) add(r.at) });
  DB.issues.forEach(i => { if (i.closed && (!uid || i.assignee === uid) && tracked.has(i.repo)) add(i.closed) });
  return set;
}

export function streakInfo(uid, state) {
  const s = activeDays(uid, state); let cur = 0, d = s.has(0) ? 0 : 1; while (s.has(d)) { cur++; d++ }
  let best = 0, run = 0; for (let k = 179; k >= 0; k--) { if (s.has(k)) { run++; best = Math.max(best, run) } else run = 0 }
  const last14 = []; for (let k = 13; k >= 0; k--) last14.push(s.has(k));
  return { cur, best, last14, set: s };
}

export function themesOf(commits, n) {
  const m = {}; commits.forEach(c => m[c.theme] = (m[c.theme] || 0) + 1);
  return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n || 3).map(e => ({ name: e[0], count: e[1] }));
}

export function repoShare(commits) {
  const m = {}; commits.forEach(c => m[c.repo] = (m[c.repo] || 0) + 1);
  const t = commits.length || 1;
  return Object.entries(m).sort((a, b) => b[1] - a[1]).map(e => ({ id: e[0], c: e[1], p: e[1] / t }));
}

export function langShare(commits, REPOS) {
  const m = {}; commits.forEach(c => {
    const repo = REPOS.find(r => r.id === c.repo);
    if(repo) {
       const l = repo.langs;
       Object.keys(l).forEach(k => m[k] = (m[k] || 0) + l[k]);
    }
  });
  const t = sum(Object.values(m)) || 1; let arr = Object.entries(m).map(e => ({ l: e[0], p: e[1] / t * 100 })).sort((a, b) => b.p - a.p);
  const main = arr.filter(a => a.p >= 4 && a.l !== 'Other'), rest = sum(arr.filter(a => !(a.p >= 4 && a.l !== 'Other')).map(a => a.p));
  if (rest > 0) main.push({ l: 'Other', p: rest }); return main;
}

export function techScores(commits, REPOS) {
  const m = {}; commits.forEach(c => {
      const repo = REPOS.find(r => r.id === c.repo);
      if(repo) repo.tech.forEach(t => m[t] = (m[t] || 0) + 1);
  });
  return Object.entries(m).sort((a, b) => b[1] - a[1]).map(e => ({ t: e[0], n: e[1] }));
}
