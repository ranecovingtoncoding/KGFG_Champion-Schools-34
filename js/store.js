/* State + scoring. All data lives in localStorage (prototype, no backend). */
(function () {
  const D = window.CS34DATA;
  const KEY = 'cs34.v1';
  const ORDER = [9, 10, 11, 12, 1, 2, 3, 4, 5];
  const DAY = 86400000;
  let S;

  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const allActs = () => D.MONTHS.flatMap(m => m.activities.map(a => ({ ...a, month: m.id }))).concat(D.DRILLS.map(a => ({ ...a, month: 'kts' })));
  const actById = (id) => allActs().find(a => a.id === id);
  const todayKey = () => new Date().toISOString().slice(0, 10);

  function seed() {
    const r = rng(34);
    const first = ['Maya', 'Liam', 'Sofia', 'Noah', 'Ava', 'Ethan', 'Isla', 'Mason', 'Zoe', 'Lucas', 'Mia', 'Owen', 'Lily', 'Caleb', 'Nora', 'Eli', 'Ruby', 'Jude', 'Ella', 'Theo', 'Hazel', 'Gabe', 'Piper', 'Reid'];
    const last = ['A.', 'B.', 'C.', 'D.', 'F.', 'G.', 'H.', 'J.', 'K.', 'L.', 'M.', 'N.', 'P.', 'R.', 'S.', 'T.', 'V.', 'W.'];
    const clock = new Date().getMonth() + 1;
    const cur = ORDER.indexOf(clock);
    const lim = cur < 0 ? 9 : cur + 1;
    const students = [], comp = {};
    first.forEach((f, i) => {
      const id = 's' + i, grade = 9 + Math.floor(r() * 4), engaged = Math.pow(r(), 1.7);
      students.push({ id, name: f + ' ' + last[Math.floor(r() * last.length)], grade });
      comp[id] = {};
      D.MONTHS.slice(0, lim).forEach(m => m.activities.forEach(a => {
        if (r() < engaged * 0.9) comp[id][a.id] = { st: 'done', ts: Date.now() - Math.floor(r() * 60) * DAY, pts: a.pts };
      }));
      D.DRILLS.forEach(a => { if (!a.daily && r() < engaged * 0.4 && !(a.grades && !a.grades.includes(grade))) comp[id][a.id] = { st: 'done', ts: Date.now() - Math.floor(r() * 60) * DAY, pts: a.pts }; });
    });
    students.push({ id: 'me', name: 'Alex (you)', grade: 10, me: true });
    comp.me = {};
    // a few verification requests waiting for a counselor
    const pend = [['s2', 'oct1'], ['s5', 'sep3'], ['s7', 'sep2'], ['s11', 'dec1']];
    pend.forEach(([sid, aid]) => { if (comp[sid]) comp[sid][aid] = { st: 'pending', ts: Date.now() - Math.floor(r() * 4) * DAY, pts: actById(aid).pts, data: { note: 'Submitted for counselor review.' } }; });
    return {
      v: 1, role: null, clock, me: { name: 'Alex', grade: 10 }, students, comp, awards: [], notices: [], redeem: [],
      accounts: [
        { id: 'a1', name: 'Jordan T.', grade: 9, email: 'jordan@example.org', ts: Date.now() - DAY },
        { id: 'a2', name: 'Priya K.', grade: 11, email: 'priya@example.org', ts: Date.now() - 2 * DAY },
        { id: 'a3', name: 'Carter L.', grade: 12, email: 'carter@example.org', ts: Date.now() - 3 * DAY }],
      wall: [{ n: 'Maya', m: 'Thank you to Coach Lee for staying after practice to help with my essay.', ts: Date.now() - 3 * DAY },
        { n: 'Liam', m: 'Thanks to my mom for driving me to every campus visit.', ts: Date.now() - 2 * DAY }],
      intake: {}, checks: { onb: {}, cal: {}, kit: {} }, launch: '', prizesCustom: [],
      schools: [{ name: 'Red Rock High (sample)', pps: 910 }, { name: 'Wasatch Peak High (sample)', pps: 760 }, { name: 'Bear Lake High (sample)', pps: 540 }]
    };
  }

  function load() {
    try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
    if (!S || S.v !== 1) S = seed();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage blocked: stays in memory */ } }
  function reset() { try { localStorage.removeItem(KEY); } catch (e) { } S = seed(); save(); }

  const get = () => S;
  const curIdx = () => { const i = ORDER.indexOf(S.clock); return i < 0 ? 9 : i; };
  const evStatus = (i) => (i < curIdx() ? 'past' : i === curIdx() ? 'live' : 'locked');

  const done = (sid, aid) => { const c = (S.comp[sid] || {})[aid]; return c && c.st === 'done' ? c : null; };
  const pending = (sid, aid) => { const c = (S.comp[sid] || {})[aid]; return c && c.st === 'pending' ? c : null; };

  function lifetime(sid) {
    let t = 0;
    Object.values(S.comp[sid] || {}).forEach(c => { if (c.st === 'done') t += c.pts; });
    S.awards.forEach(a => { if (a.sid === sid) t += a.pts; });
    return t;
  }
  const spent = (sid) => S.redeem.filter(r => r.sid === sid && r.st !== 'declined').reduce((s, r) => s + r.cost, 0);
  const balance = (sid) => lifetime(sid) - spent(sid);
  function tier(sid) {
    const p = lifetime(sid); let i = 0;
    D.TIERS.forEach((t, k) => { if (p >= t.min) i = k; });
    const next = D.TIERS[i + 1];
    return { name: D.TIERS[i].n, idx: i, next, pct: next ? Math.round((p - D.TIERS[i].min) / (next.min - D.TIERS[i].min) * 100) : 100 };
  }
  function medal(sid, monthId) {
    const m = D.MONTHS.find(x => x.id === monthId), n = m.activities.length;
    const k = m.activities.filter(a => done(sid, a.id)).length, f = k / n;
    return { done: k, total: n, tier: f >= 1 ? 'gold' : f >= 2 / 3 ? 'silver' : f >= 1 / 3 ? 'bronze' : null };
  }
  function streak(sid) {
    const days = new Set(Object.keys(S.comp[sid] || {}).filter(k => k.startsWith('daily-')).map(k => k.slice(6)));
    let n = 0, d = new Date();
    if (!days.has(d.toISOString().slice(0, 10))) d = new Date(Date.now() - DAY);
    while (days.has(d.toISOString().slice(0, 10))) { n++; d = new Date(d.getTime() - DAY); }
    return n;
  }
  function lastActive(sid) {
    const ts = Object.values(S.comp[sid] || {}).map(c => c.ts); return ts.length ? Math.max(...ts) : 0;
  }
  const rank = () => S.students.filter(s => s.id === 'me' || !s.archived).map(s => ({ ...s, pts: lifetime(s.id) })).sort((a, b) => b.pts - a.pts);

  function badges(sid) {
    const any = Object.values(S.comp[sid] || {}).some(c => c.st === 'done');
    const has = (id) => !!done(sid, id);
    const golds = D.MONTHS.filter(m => medal(sid, m.id).tier === 'gold').length;
    return [
      { id: 'first', n: 'First Steps', d: 'Complete any activity', ok: any, e: '👟' },
      { id: 'streak', n: 'On Fire', d: '3-day warm-up streak', ok: streak(sid) >= 3, e: '🔥' },
      { id: 'team', n: 'Team Player', d: 'Refer a friend', ok: has('sep2'), e: '🤝' },
      { id: 'apply', n: 'Leap of Faith', d: 'Apply for a scholarship', ok: has('dec1'), e: '🎓' },
      { id: 'plan', n: 'Pathfinder', d: 'Build your post-high-school plan', ok: has('jan1'), e: '🧭' },
      { id: 'fam', n: 'Family Affair', d: 'Complete the family conversation', ok: has('feb1'), e: '👪' },
      { id: 'form', n: 'Finish Line', d: 'FAFSA or readiness checklist', ok: has('mar1'), e: '🏁' },
      { id: 'gold', n: 'Gold Standard', d: 'Win any gold medal', ok: golds > 0, e: '🥇' },
      { id: 'season', n: 'Full Season', d: 'Gold in all 9 events', ok: golds === 9, e: '🏆' }
    ];
  }

  // actions
  function submit(sid, act, data) {
    const key = act.daily ? 'daily-' + todayKey() : act.id;
    if (act.daily && S.comp[sid][key]) return 'already';
    const st = act.verify ? 'pending' : 'done';
    S.comp[sid][key] = { st, ts: Date.now(), pts: act.pts, data: data || {}, act: act.id };
    if (act.wall && data && data.msg) S.wall.unshift({ n: sid === 'me' ? S.me.name : 'Student', m: data.msg, ts: Date.now() });
    save(); return st;
  }
  function decide(sid, key, ok, reason) {
    const c = S.comp[sid] && S.comp[sid][key]; if (!c) return;
    if (ok) { c.st = 'done'; c.ts = Date.now(); S.notices.push({ sid, t: 'Approved: ' + (actById(c.act || key).title) + ' (+' + c.pts + ' pts)', ts: Date.now() }); }
    else { delete S.comp[sid][key]; S.notices.push({ sid, t: 'Needs another try: ' + (actById(c.act || key).title) + (reason ? '. ' + reason : ''), ts: Date.now() }); }
    save();
  }
  function award(sid, pts, reason) { S.awards.push({ sid, pts: +pts, reason, ts: Date.now() }); S.notices.push({ sid, t: 'Coach awarded +' + pts + ' pts: ' + reason, ts: Date.now() }); save(); }

  function allPrizes() { return D.PRIZES.concat(S.prizesCustom); }

  window.CS34 = { D, S: get, load, save, reset, seed, ORDER, DAY, actById, allActs, curIdx, evStatus, done, pending, lifetime, balance, spent, tier, medal, streak, lastActive, rank, badges, submit, decide, award, allPrizes, todayKey };
})();
