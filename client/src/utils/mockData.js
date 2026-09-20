export const DAY = 864e5, HOUR = 36e5, MIN = 6e4;

// seeded random generator
export function mulberry(seed) {
  return function () {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
const R = mulberry(20260920);
export const rand = (a, b) => a + R() * (b - a);
export const ri = (a, b) => Math.floor(rand(a, b + 1));
export const pick = a => a[Math.floor(R() * a.length)];
export function wpick(items, w) {
  let t = w.reduce((x, y) => x + y, 0), r = R() * t;
  for (let i = 0; i < items.length; i++) {
    r -= w[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}
export function poisson(l) {
  if (l <= 0) return 0;
  const L = Math.exp(-l);
  let k = 0, p = 1;
  do { k++; p *= R() } while (p > L && k < 60);
  return k - 1;
}
export function lognorm(med, sig) {
  const u = 1 - R(), v = R();
  return med * Math.exp(sig * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v));
}
export function shuffle(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(R() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

// time
export const NOW = Date.now();
export const T0 = (() => { const d = new Date(NOW); d.setHours(0, 0, 0, 0); return d.getTime() })();
export const dayStart = k => { const d = new Date(T0); d.setDate(d.getDate() - k); return d.getTime() };
export const dayIdx = t => Math.ceil((T0 - t) / DAY) || 0;
export const fmtD = t => new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
export const fmtW = t => new Date(t).toLocaleDateString('en-US', { weekday: 'short' });
export const fmtDW = t => new Date(t).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
export const ago = t => {
  const m = Math.max(0, Math.round((Date.now() - t) / MIN));
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.round(m / 60);
  if (h < 24) return h + 'h ago';
  return Math.round(h / 24) + 'd ago';
};
export const fmtDur = h => {
  if (!h || !isFinite(h)) return '—';
  if (h < 1) return Math.max(1, Math.round(h * 60)) + 'm';
  if (h < 24) { const m = Math.round((h % 1) * 60); return Math.floor(h) + 'h ' + (m < 10 ? '0' : '') + m + 'm' }
  const d = Math.floor(h / 24);
  return d + 'd ' + Math.round(h % 24) + 'h';
};
export const fmtN = v => v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v >= 1e4 ? Math.round(v / 1e3) + 'k' : v >= 1e3 ? (v / 1e3).toFixed(1).replace('.0', '') + 'k' : (Math.round(v * 10) / 10).toString();
export const pct = (a, b) => b ? Math.round((a - b) / b * 100) : (a ? 100 : 0);

// team & repos
export const ME = 'uttam';
export const USERS = [
  { id: 'uttam', name: 'Uttam Kumar', first: 'Uttam', role: 'Full Stack Developer', gh: 'uttamkumar', color: '#3563E9', wk: 6.4, we: 1.0, aff: [3, 3, 2.5, 1, 1, .3, .4] },
  { id: 'rahul', name: 'Rahul Sharma', first: 'Rahul', role: 'Backend Engineer', gh: 'rahul-codes', color: '#0B8A7B', wk: 4.6, we: .4, aff: [3, .2, 3, 2, 2.5, .5, .2] },
  { id: 'aman', name: 'Aman Verma', first: 'Aman', role: 'Frontend Engineer', gh: 'amanverma', color: '#7C4DE0', wk: 4.2, we: .3, aff: [.5, 4, .3, .5, .2, .2, 1] },
  { id: 'priya', name: 'Priya Nair', first: 'Priya', role: 'DevOps Engineer', gh: 'priya-nair', color: '#C77F00', wk: 3.4, we: .3, aff: [.3, .1, .3, 1, 1, 4, .5] },
  { id: 'sneha', name: 'Sneha Iyer', first: 'Sneha', role: 'Full Stack Developer', gh: 'sneha-iyer', color: '#D62A48', wk: 3.8, we: .2, aff: [1, 1.5, 1, .5, 1, .2, 2] }
];
export const U = id => USERS.find(u => u.id === id) || USERS[0];
export const REPOS = [
  { id: 'ecommerce-api', lang: 'TypeScript', priv: false, stars: 184, desc: 'Catalog, cart and order APIs for the storefront.', fe: 'None (API only)', be: 'Node.js + Express', db: 'PostgreSQL + Redis cache', modules: ['Catalog', 'Cart', 'Orders', 'Users'], tech: ['Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS'], langs: { TypeScript: 78, JavaScript: 9, SQL: 8, Other: 5 }, themes: [['Order tracking', 3], ['Checkout flow', 3], ['API optimization', 2], ['Authentication', 1.5]] },
  { id: 'frontend-dashboard', lang: 'TypeScript', priv: false, stars: 96, desc: 'Customer and admin dashboard built with React.', fe: 'React + TypeScript + Tailwind CSS', be: 'Consumes ecommerce-api', db: 'None (client app)', modules: ['Dashboard', 'Charts', 'Settings', 'Auth screens'], tech: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts'], langs: { TypeScript: 62, CSS: 20, JavaScript: 10, HTML: 8 }, themes: [['Dashboard improvements', 4], ['Mobile navigation', 2], ['Authentication', 1.5], ['Accessibility', 1]] },
  { id: 'payment-service', lang: 'JavaScript', priv: true, stars: 41, desc: 'Payments, refunds and webhook processing.', fe: 'None', be: 'Node.js + Express', db: 'MongoDB', modules: ['Payments', 'Refunds', 'Webhooks', 'Invoices'], tech: ['Node.js', 'MongoDB', 'Stripe', 'Docker'], langs: { JavaScript: 84, TypeScript: 10, Other: 6 }, themes: [['Payment APIs', 4], ['Webhook reliability', 2], ['Refunds', 1.5]] },
  { id: 'auth-gateway', lang: 'Go', priv: true, stars: 23, desc: 'Session, OAuth and rate limiting gateway.', fe: 'None', be: 'Go', db: 'Redis', modules: ['Sessions', 'OAuth', 'Rate limiting'], tech: ['Go', 'Redis', 'JWT', 'Docker'], langs: { Go: 91, Shell: 5, Other: 4 }, themes: [['Authentication', 3], ['Session handling', 2], ['Rate limiting', 1.5]] },
  { id: 'order-tracker', lang: 'Python', priv: false, stars: 58, desc: 'Carrier polling and delivery notifications.', fe: 'None', be: 'FastAPI + Celery', db: 'PostgreSQL', modules: ['Tracking', 'Notifications', 'Carriers'], tech: ['Python', 'FastAPI', 'PostgreSQL', 'Celery'], langs: { Python: 88, SQL: 7, Other: 5 }, themes: [['Order tracking', 3], ['Notifications', 2]] },
  { id: 'devops-configs', lang: 'HCL', priv: true, stars: 12, desc: 'Terraform, Docker images and CI workflows.', fe: 'None', be: 'Terraform + GitHub Actions', db: 'None', modules: ['Networking', 'Deploy', 'Pipelines'], tech: ['Terraform', 'Docker', 'GitHub Actions', 'AWS'], langs: { HCL: 56, Shell: 22, Dockerfile: 14, Other: 8 }, themes: [['CI/CD', 3], ['Infrastructure', 2], ['Docker builds', 2]] },
  { id: 'docs-portal', lang: 'MDX', priv: false, stars: 35, desc: 'Developer documentation and API guides.', fe: 'React + MDX', be: 'None (static site)', db: 'None', modules: ['API guides', 'Tutorials', 'Changelog'], tech: ['MDX', 'React', 'Markdown'], langs: { MDX: 70, CSS: 15, HTML: 10, Other: 5 }, themes: [['Documentation', 1]] }
];
export const REPO_COL = ['#3563E9', '#7C4DE0', '#0B8A7B', '#C77F00', '#D62A48', '#2F86C8', '#7B8AA6'];
REPOS.forEach((r, i) => { r.i = i; r.col = REPO_COL[i] });
export const RP = id => REPOS.find(r => r.id === id) || REPOS[0];
export const LANG_COL = { TypeScript: '#3178C6', JavaScript: '#E8C900', Go: '#00ADD8', Python: '#3572A5', HCL: '#844FBA', MDX: '#F5A623', CSS: '#8A63D2', HTML: '#E34C26', Shell: '#6DBE45', SQL: '#E38C00', Dockerfile: '#2496ED', Other: '#8794AD' };

export const THEME_MSGS = {
  'Authentication': ['Add Google sign-in callback', 'Refresh token rotation', 'Harden session cookie flags', 'Fix logout redirect loop', 'Validate OAuth state parameter'],
  'Payment APIs': ['Add idempotency keys to charge endpoint', 'Handle partial refunds', 'Validate card fingerprint', 'Retry failed capture calls', 'Add invoice PDF endpoint'],
  'Dashboard improvements': ['Add date range picker', 'Tune chart tooltips', 'Persist filter selection', 'Lazy load heavy charts', 'Fix empty-state layout'],
  'Checkout flow': ['Add guest checkout', 'Recalculate totals on coupon change', 'Save address book entries', 'Fix shipping estimate rounding', 'Add order review step'],
  'Order tracking': ['Add tracking timeline endpoint', 'Poll carrier status updates', 'Add delivery ETA to order page', 'Send shipped notification', 'Map carrier status codes'],
  'API optimization': ['Cache product listing responses', 'Add composite index on orders', 'Batch inventory lookups', 'Reduce N+1 queries in cart', 'Compress large JSON payloads'],
  'Mobile navigation': ['Fix mobile nav overflow', 'Add bottom tab bar', 'Improve drawer focus trap', 'Fix iOS safe-area padding'],
  'Webhook reliability': ['Verify webhook signatures', 'Add webhook retry backoff', 'Store raw webhook events', 'Dedupe replayed events'],
  'Session handling': ['Extend session on activity', 'Fix session expiry edge case', 'Revoke sessions on password change'],
  'Rate limiting': ['Add sliding window limiter', 'Return Retry-After header', 'Add per-key limit overrides'],
  'Notifications': ['Add SMS provider fallback', 'Add order email templates', 'Fix duplicate notification sends'],
  'CI/CD': ['Cache dependencies in workflow', 'Add preview deploys', 'Split test matrix', 'Pin action versions'],
  'Infrastructure': ['Add staging VPC module', 'Rotate IAM roles', 'Tune autoscaling policy'],
  'Docker builds': ['Multi-stage build for API', 'Slim base image', 'Add healthcheck to compose'],
  'Documentation': ['Add API quickstart', 'Document webhook events', 'Update auth guide', 'Fix broken sidebar links'],
  'Accessibility': ['Add focus rings to filters', 'Fix chart aria labels', 'Improve contrast on badges'],
  'Refunds': ['Add refund reasons', 'Handle partial refunds', 'Add refund audit log']
};
export const typeOf = m => /^(Fix|Dedupe)/.test(m) ? 'fix' : /^(Document|Update .*guide|Add API quickstart)/.test(m) ? 'docs' : /^(Cache|Batch|Reduce|Compress|Tune|Lazy|Add composite|Add sliding|Extend)/.test(m) ? 'perf' : /^(Pin|Rotate|Split|Multi-stage|Slim|Add healthcheck|Add staging)/.test(m) ? 'chore' : 'feat';
const PAST = { Add: 'Added', Refresh: 'Refreshed', Harden: 'Hardened', Fix: 'Fixed', Validate: 'Validated', Retry: 'Retried', Tune: 'Tuned', Persist: 'Persisted', Recalculate: 'Recalculated', Save: 'Saved', Poll: 'Polled', Send: 'Sent', Map: 'Mapped', Cache: 'Cached', Batch: 'Batched', Reduce: 'Reduced', Compress: 'Compressed', Verify: 'Verified', Store: 'Stored', Dedupe: 'Deduplicated', Extend: 'Extended', Revoke: 'Revoked', Return: 'Returned', Improve: 'Improved', Document: 'Documented', Update: 'Updated', Rotate: 'Rotated', Pin: 'Pinned', Split: 'Split', Slim: 'Slimmed', Handle: 'Handled' };
export const past = t => { const w = t.split(' '); return (PAST[w[0]] ? [PAST[w[0]]].concat(w.slice(1)) : w).join(' ') };
const LABELS = ['bug', 'feature', 'enhancement', 'performance', 'security', 'docs'];
const ISSUE_TITLES = {
  bug: ['Session expires earlier than configured', 'Cart total mismatch with discount codes', 'Mobile menu overlaps page content', 'Webhook retries create duplicate orders', 'Date filter resets after refresh', 'Refund status stuck on pending'],
  feature: ['Support guest checkout', 'Export report as CSV', 'Add saved payment methods', 'Order status email templates', 'Bulk import products'],
  enhancement: ['Improve empty states', 'Show PR size on repo cards', 'Clearer errors for failed sync', 'Keyboard shortcuts for filters'],
  performance: ['Slow product listing under load', 'Dashboard query takes 3s+', 'Large payload on order history', 'Docker image build is too slow'],
  security: ['Rotate leaked staging credentials', 'Missing CSRF check on settings route', 'Tighten CORS on public endpoints'],
  docs: ['Document webhook event payloads', 'Update local setup guide', 'Add architecture diagram']
};

export const DB = { commits: [], prs: [], reviews: [], issues: [] };
export const RV = {};
const prCount = {}, isCount = {};

export function makePR(c) {
  const nowT = Date.now(), age = (nowT - c.t) / DAY;
  const num = (prCount[c.repo] = (prCount[c.repo] || 100) + ri(1, 3));
  const revs = shuffle(USERS.filter(u => u.id !== c.user)).slice(0, ri(1, 3));
  const resp0 = Math.max(.3, lognorm(5.5, .75));
  const p = { id: c.repo + '#' + num, num, repo: c.repo, author: c.user, title: c.msg, type: typeOf(c.msg), theme: c.theme, created: c.t, state: 'open', mergedAt: null, closedAt: null, add: Math.round(lognorm(120, 1.1)), del: Math.round(lognorm(45, 1.1)), firstReview: null, pending: [] };
  p.files = Math.max(1, Math.round((p.add + p.del) / 45 * (.5 + R())));
  const openP = age < 1 ? .55 : age < 4 ? .3 : age < 12 ? .08 : age < 20 ? .02 : 0;
  if (R() >= openP) {
    if (R() < .88) { const mt = c.t + (resp0 + Math.max(1, lognorm(9, .7))) * HOUR; if (mt <= nowT) { p.mergedAt = mt; p.state = 'merged' } }
    else { const ct = c.t + lognorm(30, .9) * HOUR; if (ct <= nowT) { p.closedAt = ct; p.state = 'closed' } }
  }
  revs.forEach((u, i) => {
    const rh = resp0 * (1 + i * .7 * R()), at = c.t + rh * HOUR;
    if (at <= nowT) {
      const st = wpick(['approved', 'commented', 'changes'], [58, 27, 15]);
      const rv = { pr: p.id, repo: p.repo, author: p.author, reviewer: u.id, state: st, at, comments: st === 'approved' ? ri(0, 3) : ri(1, 8), resp: rh, title: p.title, num: p.num };
      DB.reviews.push(rv); (RV[p.id] = RV[p.id] || []).push(rv);
      if (!p.firstReview || at < p.firstReview) p.firstReview = at;
    } else p.pending.push(u.id);
  });
  if (p.state === 'merged') { const rs = RV[p.id] || []; if (rs.length && !rs.some(r => r.state === 'approved')) rs[rs.length - 1].state = 'approved' }
  if (p.state !== 'open') p.pending = [];
  DB.prs.push(p); return p;
}

export function makeIssue(t) {
  const repo = wpick(REPOS, [3, 3, 2.5, 1.5, 1.5, 1, 1]);
  const label = wpick(LABELS, [38, 20, 20, 9, 6, 7]);
  const pr = wpick(['Low', 'Medium', 'High', 'Critical'], [25, 45, 22, 8]);
  const asg = wpick(USERS, USERS.map(u => u.aff[repo.i]));
  const med = { Low: 110, Medium: 56, High: 28, Critical: 9 }[pr];
  const rh = Math.max(.5, lognorm(med, .85));
  const num = (isCount[repo.id] = (isCount[repo.id] || 40) + ri(1, 3));
  const it = { id: repo.id + '#' + num, num, repo: repo.id, author: pick(USERS).id, assignee: asg.id, title: pick(ISSUE_TITLES[label]), label, priority: pr, created: t, closed: null };
  const ct = t + rh * HOUR;
  if (ct <= Date.now() && R() > .03) it.closed = ct;
  DB.issues.push(it); return it;
}

export function generateDB() {
  const wkNoise = {}, focus = {}; let cid = 1;
  const hourNow = new Date(NOW).getHours();
  for (let d = 179; d >= 0; d--) {
    const day0 = dayStart(d), wd = new Date(day0).getDay(), wknd = wd === 0 || wd === 6, wk = Math.floor(d / 7);
    USERS.forEach(u => {
      const key = u.id + wk;
      if (!wkNoise[key]) {
        wkNoise[key] = .7 + R() * .6;
        const pool = []; REPOS.forEach(r => { if (u.aff[r.i] >= 1) r.themes.forEach(t => { if (pool.indexOf(t[0]) < 0) pool.push(t[0]) }) });
        focus[key] = shuffle(pool).slice(0, 2);
      }
      let lam = (wknd ? u.we : u.wk) * wkNoise[key] * (.8 + .35 * (1 - d / 180));
      if (u.id === ME && d < 7) lam *= 1.18;
      if (d === 0) lam *= Math.max(.35, hourNow / 20);
      const n = poisson(lam);
      for (let k = 0; k < n; k++) {
        const repo = wpick(REPOS, u.aff);
        const fc = repo.themes.filter(t => focus[key].indexOf(t[0]) >= 0);
        const th = (fc.length && R() < .7) ? fc[0][0] : wpick(repo.themes.map(t => t[0]), repo.themes.map(t => t[1]));
        const hr = clamp(14 + (R() + R() + R() - 1.5) * 5, 8, 22);
        let t = day0 + hr * HOUR; if (t > NOW) t = NOW - ri(2, 300) * MIN;
        DB.commits.push({ id: cid++, t, repo: repo.id, user: u.id, msg: pick(THEME_MSGS[th]), theme: th, add: Math.round(lognorm(38, 1)), del: Math.round(lognorm(14, 1)) });
      }
    });
    const ni = poisson(wknd ? .4 : 1.5);
    for (let k = 0; k < ni; k++) { let t = day0 + clamp(11 + (R() + R() - 1) * 6, 8, 21) * HOUR; if (t > NOW) t = NOW - ri(5, 200) * MIN; makeIssue(t) }
  }
  DB.commits.sort((a, b) => a.t - b.t);
  DB.commits.forEach(c => { if (R() < .15) makePR(c) });
  DB.reviews.sort((a, b) => a.at - b.at);
  DB.prs.sort((a, b) => a.created - b.created);
}

export function simulate(n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const r = R(), now = Date.now();
    const newCommit = () => {
      const u = wpick(USERS, USERS.map(x => x.wk)), repo = wpick(REPOS, u.aff);
      const th = wpick(repo.themes.map(t => t[0]), repo.themes.map(t => t[1]));
      const c = { id: DB.commits.length + 1, t: now - ri(1, 15) * MIN, repo: repo.id, user: u.id, msg: pick(THEME_MSGS[th]), theme: th, add: Math.round(lognorm(38, 1)), del: Math.round(lognorm(14, 1)) };
      DB.commits.push(c); return { c, u, repo };
    };
    if (r < .55) { const x = newCommit(); out.push(`${x.u.first} pushed to ${x.repo.id}`) }
    else if (r < .7) { const x = newCommit(), p = makePR(x.c); p.created = now - ri(1, 10) * MIN; out.push(`${x.u.first} opened PR #${p.num} in ${p.repo}`) }
    else if (r < .85) {
      const open = DB.prs.filter(p => p.state === 'open' && p.pending.length);
      if (open.length) {
        const p = pick(open), rid = p.pending.shift(); const st = wpick(['approved', 'commented', 'changes'], [58, 27, 15]);
        const rv = { pr: p.id, repo: p.repo, author: p.author, reviewer: rid, state: st, at: now - ri(1, 5) * MIN, comments: st === 'approved' ? ri(0, 3) : ri(1, 8), resp: Math.max(.3, (now - p.created) / HOUR), title: p.title, num: p.num };
        DB.reviews.push(rv); (RV[p.id] = RV[p.id] || []).push(rv); if (!p.firstReview) p.firstReview = rv.at;
        out.push(`${U(rid).first} reviewed PR #${p.num} in ${p.repo}`)
      }
      else { const x = newCommit(); out.push(`${x.u.first} pushed to ${x.repo.id}`) }
    } else {
      const open = DB.issues.filter(it => !it.closed);
      if (open.length) { const it = pick(open); it.closed = now - ri(1, 8) * MIN; out.push(`${U(it.assignee).first} closed issue #${it.num} in ${it.repo}`) }
      else { const x = newCommit(); out.push(`${x.u.first} pushed to ${x.repo.id}`) }
    }
  }
  return out;
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export const store = {
  get(k, d) { try { const v = localStorage.getItem('dp:' + k); return v === null ? d : JSON.parse(v) } catch (e) { return d } },
  set(k, v) { try { localStorage.setItem('dp:' + k, JSON.stringify(v)) } catch (e) { } },
  clear() { try { Object.keys(localStorage).filter(k => k.indexOf('dp:') === 0).forEach(k => localStorage.removeItem(k)) } catch (e) { } }
};

// INITIALIZE DB ON LOAD
generateDB();
