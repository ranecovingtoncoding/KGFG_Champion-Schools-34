/* Champion Schools 34: views and routing (vanilla JS, hash router). */
(function () {
  const C = window.CS34, D = C.D;
  const PLATFORM_URL = 'https://www.ktsutah.org/';
  const SCHOOL = 'Demo High School';
  let ui = { modal: null, podTab: 'school', stuQ: '', stuGrade: 'all', intakeTab: 'form', kitMonth: null, toast: '' };

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const S = () => C.S();
  const ago = (ts) => { if (!ts) return 'never'; const d = Math.floor((Date.now() - ts) / C.DAY); return d <= 0 ? 'today' : d === 1 ? 'yesterday' : d + ' days ago'; };
  const monthById = (id) => D.MONTHS.find(m => m.id === id);
  const ordinal = (i) => i + 1;

  // ---------- SVG bits ----------
  const medalSVG = (tier, size) => {
    size = size || 56;
    const c = { gold: ['#FFE27A', '#D4A017'], silver: ['#F4F6FA', '#9AA5B1'], bronze: ['#F2B47E', '#A8642A'], none: ['#2C3566', '#232B58'] }[tier || 'none'];
    return `<svg class="medal ${tier ? '' : 'medal-none'}" width="${size}" height="${Math.round(size * 1.17)}" viewBox="0 0 60 70" aria-label="${tier || 'no'} medal" role="img">
      <path d="M14 0h12l4 20H18z" fill="#E4002B"/><path d="M46 0H34l-4 20h12z" fill="#1E6BFF"/>
      <circle cx="30" cy="44" r="22" fill="${c[1]}"/><circle cx="30" cy="44" r="18" fill="${c[0]}"/>
      <path d="M30 31l3.7 8.4 9.1.9-6.9 6 2.1 9-8-4.8-8 4.8 2.1-9-6.9-6 9.1-.9z" fill="${c[1]}" opacity="${tier ? .9 : .5}"/></svg>`;
  };
  const torchSVG = `<svg width="64" height="96" viewBox="0 0 64 96" aria-hidden="true"><path d="M32 2c8 12 18 18 18 32a18 18 0 0 1-36 0c0-8 5-12 8-18 3 5 6 6 6 6 2-6 0-14 4-20z" fill="#F97316"/><path d="M32 22c5 7 10 11 10 19a10 10 0 0 1-20 0c0-5 3-8 5-11 2 3 3 3 3 3 1-4 0-7 2-11z" fill="#FFD166"/><path d="M14 58h36l-5 14H19z" fill="#F5C542"/><path d="M22 72h20l-3 22H25z" fill="#C99A1A"/></svg>`;
  const initials = (n) => n.replace(/\(you\)/, '').trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  function podiumHTML(items) {
    const heights = { 0: 150, 1: 112, 2: 84 }, cls = ['gold', 'silver', 'bronze'];
    return `<div class="podium" role="list">` + [1, 0, 2].map(i => {
      const it = items[i]; if (!it) return `<div class="pod-col"></div>`;
      return `<div class="pod-col" role="listitem"><div class="pod-who ${it.me ? 'me' : ''}"><div class="avatar">${esc(initials(it.name))}</div><b>${esc(it.name)}</b><span>${it.pts.toLocaleString()} pts</span></div>
        <div class="pod-block ${cls[i]}" style="height:${heights[i]}px"><span>${i + 1}</span></div></div>`;
    }).join('') + `</div>`;
  }

  // ---------- Shell ----------
  const logo = `<a class="logo-pill" href="#/" aria-label="Champion Schools 34 x Ken Garff for Good"><img src="assets/logo.png" alt="Champion Schools 34 | Ken Garff for Good"></a>`;

  function studentShell(inner, active) {
    const st = S(), me = 'me', t = C.tier(me);
    const nav = [['home', 'Training Room', '🏋️'], ['events', 'Events', '📅'], ['podium', 'Podium', '🏆'], ['medals', 'My Medals', '🥇'], ['prizes', 'Prize Locker', '🎁']];
    return `<div class="stu">
      <header class="topbar">${logo}
        <nav class="nav" aria-label="Student">${nav.map(n => `<a href="#/student/${n[0]}" class="${active === n[0] ? 'on' : ''}"><span>${n[2]}</span>${n[1]}</a>`).join('')}</nav>
        <div class="chips"><span class="chip gold" title="Points you can spend">⭐ ${C.balance(me).toLocaleString()}</span><span class="chip">${esc(t.name)}</span>
        <a class="chip ghost" href="#/" data-a="logout">Exit</a></div>
      </header>
      <main id="main" class="wrap">${inner}</main>
      ${demoClock()}
    </div>`;
  }

  function demoClock() {
    const st = S();
    return `<footer class="demo"><span>Prototype with sample data.</span> <label>Demo calendar month <select data-change="clock">${C.ORDER.concat([6]).map(m => `<option value="${m}" ${st.clock === m ? 'selected' : ''}>${new Date(2026, m - 1, 1).toLocaleString('en', { month: 'long' })}${m === 6 ? ' (summer)' : ''}</option>`).join('')}</select></label> <button class="link" data-a="reset">Reset demo data</button></footer>`;
  }

  function adminShell(inner, active) {
    const st = S();
    const pend = pendingItems().length + st.accounts.length + st.redeem.filter(r => r.st === 'pending').length;
    const nav = [['dashboard', 'Dashboard', '📊'], ['approvals', 'Approvals', '✅', pend], ['students', 'Students & Points', '👥'], ['readiness', 'School Readiness', '📝'], ['kit', 'Activation Kit', '📣'], ['onboarding', 'Onboarding & Calendar', '🎬'], ['prizes', 'School Prizes', '🎁']];
    return `<div class="adm">
      <aside class="side">${logo.replace('class="logo-pill"', 'class="logo-pill sm"')}
        <div class="who"><b>Key Contact view</b><span>${SCHOOL}</span></div>
        <nav aria-label="Administrator">${nav.map(n => `<a href="#/admin/${n[0]}" class="${active === n[0] ? 'on' : ''}"><span>${n[2]}</span>${n[1]}${n[3] ? `<em class="badge">${n[3]}</em>` : ''}</a>`).join('')}</nav>
        <div class="side-foot"><a href="#/student/home" data-a="as-student">View as student</a><a href="#/" data-a="logout">Sign out</a></div></aside>
      <main id="main" class="panel">${inner}${demoClock()}</main></div>`;
  }

  // ---------- Landing ----------
  function landing() {
    const st = S();
    return `<div class="landing">
      <div class="hero-card">
        <div class="logo-pill big"><img src="assets/logo.png" alt="Champion Schools 34 | Ken Garff for Good"></div>
        <h1>Train for what comes after high school.</h1>
        <p class="lead">Nine monthly events, one Olympic value each. Earn points, win medals, climb the podium, and take your next step toward college and career.</p>
        <div class="role-grid">
          <form class="role-card stu-card" data-submit="login-student">
            <h2>🏅 I'm a student</h2>
            <label>First name<input name="name" value="${esc(st.me.name)}" maxlength="20" required></label>
            <label>Grade<select name="grade">${[9, 10, 11, 12].map(g => `<option ${st.me.grade === g ? 'selected' : ''}>${g}</option>`).join('')}</select></label>
            <button class="btn gold">Enter the Stadium →</button>
          </form>
          <div class="role-card adm-card"><h2>📋 I'm a counselor or key contact</h2>
            <p>Approve accounts, award points, run your launch plan and the monthly activation kit.</p>
            <a class="btn" href="#/admin/dashboard" data-a="login-admin">Open admin dashboard →</a></div>
        </div>
        <p class="fine">Prototype with sample data for ${esc(SCHOOL)}. Built from the Trailblazers final presentation for Ken Garff for Good.</p>
      </div></div>`;
  }

  // ---------- Student: Training Room ----------
  function activityRow(a, sid, opts) {
    opts = opts || {};
    const st = S(), done = C.done(sid, a.id), pend = C.pending(sid, a.id);
    const locked = opts.locked;
    const state = done ? 'done' : pend ? 'pend' : locked ? 'lock' : 'todo';
    const gradeBlock = a.grades && !a.grades.includes(st.me.grade);
    return `<li class="act ${state}">
      <div class="act-ic">${done ? '✔' : pend ? '⏳' : locked ? '🔒' : (a.icon || '▶')}</div>
      <div class="act-b"><b>${esc(a.title)}</b>
        <span>${a.mins ? '~' + a.mins + ' min · ' : ''}${a.verify ? 'counselor checks it · ' : ''}${a.type}</span>
        ${gradeBlock ? `<span class="tag">Grade ${a.grades.join(', ')} only</span>` : ''}</div>
      <div class="act-r"><span class="pts">+${a.pts}</span>
        ${done ? '<span class="tag ok">Done</span>' : pend ? '<span class="tag wait">In review</span>' : locked ? '<span class="tag">Locked</span>' : gradeBlock ? '' : `<button class="btn sm" data-a="open-act" data-id="${a.id}">${a.daily ? 'Check in' : 'Start'}</button>`}</div>
    </li>`;
  }

  function noticesHTML() {
    const st = S(), n = st.notices.filter(x => x.sid === 'me' && !x.seen);
    if (!n.length) return '';
    return `<div class="notice">${n.slice(-3).map(x => `<p>🔔 ${esc(x.t)}</p>`).join('')}<button class="link" data-a="dismiss-notices">Dismiss</button></div>`;
  }

  function stuHome() {
    const st = S(), me = 'me', t = C.tier(me), ci = C.curIdx(), live = ci < 9 ? D.MONTHS[ci] : null;
    const checked = !!st.comp.me['daily-' + C.todayKey()];
    const sp = live ? (() => {
      const md = C.medal(me, live.id);
      return `<section class="spot" style="--ev:${live.color}">
        <div class="spot-ic">${live.icon}</div>
        <div class="spot-b"><span class="eyebrow">LIVE EVENT ${ordinal(ci)} OF 9 · ${live.name.toUpperCase()}</span>
          <h2>${esc(live.event)}</h2>
          <p class="val"><span class="vchip">Olympic value: ${esc(live.value)}</span><span class="vchip alt">${esc(live.initiative)}</span></p>
          <p>${esc(live.tagline)}</p>
          <div class="prog"><i style="width:${md.done / md.total * 100}%"></i></div>
          <p class="small">${md.done} of ${md.total} activities · Prize: ${esc(live.prize)}</p>
          <a class="btn gold" href="#/student/event/${live.id}">Enter the event →</a></div>
        <div class="spot-m">${medalSVG(md.tier, 72)}</div></section>`;
    })() : `<section class="spot"><div class="spot-ic">☀️</div><div class="spot-b"><h2>Summer training</h2><p>Events open again in September. Catch up on any past event, or do a drill.</p><a class="btn gold" href="#/student/events">See all events</a></div></section>`;
    return noticesHTML() + `
      <section class="greet">
        <div class="torch">${torchSVG}</div>
        <div><h1>Welcome to the Training Room, ${esc(st.me.name)}.</h1>
          <p class="lead">You are a <b>${esc(t.name)}</b>${t.next ? ` · ${t.next.min - C.lifetime(me)} pts to <b>${t.next.n}</b>` : ' · top tier!'} · 🔥 ${C.streak(me)}-day streak</p>
          <div class="prog big"><i style="width:${t.pct}%"></i></div></div>
        <button class="btn ${checked ? 'ghost' : 'gold'}" data-a="${checked ? '' : 'daily'}" ${checked ? 'disabled' : ''}>${checked ? '✔ Warmed up today' : '🔥 Daily Warm-Up +10'}</button>
      </section>
      ${sp}
      <section><h2 class="sec">Keys to Success drills <small>year-round training</small></h2>
        <ul class="acts">${D.DRILLS.filter(d => !d.daily).map(a => activityRow(a, me)).join('')}</ul></section>
      <section><h2 class="sec">Medal rack</h2>
        <div class="rack">${D.MONTHS.map((m, i) => `<a href="#/student/event/${m.id}" class="rack-i" title="${m.event}">${medalSVG(C.medal(me, m.id).tier, 44)}<span>${m.name.slice(0, 3)}</span></a>`).join('')}</div></section>`;
  }

  // ---------- Student: Events ----------
  function stuEvents() {
    return `<h1 class="pagetitle">Event schedule</h1><p class="lead">One event a month, September to May. Each has an Olympic value, a higher-ed focus, and a prize.</p>
    <div class="ev-grid">${D.MONTHS.map((m, i) => {
      const s = C.evStatus(i), md = C.medal('me', m.id);
      return `<a class="ev ${s}" style="--ev:${m.color}" href="#/student/event/${m.id}">
        <div class="ev-top"><span class="ev-ic">${m.icon}</span><span class="ev-st">${s === 'live' ? '● LIVE' : s === 'locked' ? '🔒 Opens ' + m.name : 'Open'}</span></div>
        <small>${m.name}</small><h3>${esc(m.event)}</h3><p><b>${esc(m.value)}</b> · ${esc(m.initiative)}</p>
        <div class="ev-bot">${medalSVG(md.tier, 34)}<span>${md.done}/${md.total} done</span></div></a>`;
    }).join('')}</div>`;
  }

  function stuEvent(id) {
    const m = monthById(id); if (!m) return stuEvents();
    const i = D.MONTHS.indexOf(m), s = C.evStatus(i), md = C.medal('me', id), st = S();
    const acts = m.activities.map(a => {
      if (a.alt && st.me.grade < 12) return { ...a, ...{ title: a.alt.title, lesson: a.alt.lesson, fields: a.alt.fields } };
      return a;
    });
    const steps = [['bronze', '1/3'], ['silver', '2/3'], ['gold', 'all']];
    return `<a class="back" href="#/student/events">← All events</a>
    <section class="evhead" style="--ev:${m.color}"><div class="spot-ic">${m.icon}</div>
      <div><span class="eyebrow">EVENT ${ordinal(i)} OF 9 · ${m.name.toUpperCase()}</span><h1>${esc(m.event)}</h1>
        <p class="val"><span class="vchip">Olympic value: ${esc(m.value)}</span><span class="vchip alt">${esc(m.initiative)}</span></p><p>${esc(m.tagline)}</p></div>
      <div class="spot-m">${medalSVG(md.tier, 84)}</div></section>
    ${s === 'locked' ? `<div class="notice">🔒 This event opens in ${m.name}. Preview the activities below.</div>` : ''}
    <div class="two"><section><h2 class="sec">Activities</h2><ul class="acts">${acts.map(a => activityRow(a, 'me', { locked: s === 'locked' })).join('')}</ul></section>
      <aside><div class="card"><h3>Medal progress</h3><div class="steps">${steps.map(x => `<div class="${md.tier === x[0] || (x[0] === 'bronze' && md.tier) || (x[0] === 'silver' && (md.tier === 'silver' || md.tier === 'gold')) ? 'hit' : ''}">${medalSVG(x[0], 38)}<span>${x[0]}<br><small>${x[1]}</small></span></div>`).join('')}</div></div>
        <div class="card"><h3>🎁 Event prize</h3><p>${esc(m.prize)}</p><p class="small">Prizes are confirmed by Ken Garff for Good. Check the Prize Locker for what you can redeem.</p></div>
        ${m.id === 'nov' ? `<div class="card"><h3>💛 Gratitude board</h3>${st.wall.slice(0, 6).map(w => `<p class="wall"><b>${esc(w.n)}</b>: ${esc(w.m)}</p>`).join('')}</div>` : ''}</aside></div>`;
  }

  // ---------- Student: Podium, Medals, Prizes ----------
  function stuPodium() {
    const r = C.rank(), st = S();
    const myRank = r.findIndex(x => x.id === 'me') + 1;
    const pps = Math.round(r.reduce((s, x) => s + x.pts, 0) / r.length);
    const schools = st.schools.concat([{ name: SCHOOL + ' (yours)', pps, me: true }]).sort((a, b) => b.pps - a.pps).map(x => ({ name: x.name, pts: x.pps, me: x.me }));
    const list = ui.podTab === 'school' ? r : schools;
    return `<h1 class="pagetitle">The Podium</h1>
    <div class="tabs"><button class="${ui.podTab === 'school' ? 'on' : ''}" data-a="pod" data-t="school">My school</button><button class="${ui.podTab === 'state' ? 'on' : ''}" data-a="pod" data-t="state">Champion Schools</button></div>
    ${podiumHTML(list.slice(0, 3))}
    <p class="lead center">${ui.podTab === 'school' ? `You are ranked <b>#${myRank}</b> of ${r.length} at ${esc(SCHOOL)}.` : `Schools are ranked by average points per student, so every school size can win.`}</p>
    <ol class="board">${list.slice(0, 10).map((x, i) => `<li class="${x.me ? 'me' : ''}"><span class="rk">${i + 1}</span><span class="nm">${esc(x.name)}</span><span class="sc">${(x.pts).toLocaleString()} ${ui.podTab === 'school' ? 'pts' : 'avg pts'}</span></li>`).join('')}</ol>
    ${ui.podTab === 'school' && myRank > 10 ? `<p class="small center">Your rank: #${myRank}</p>` : ''}`;
  }

  function stuMedals() {
    const t = C.tier('me');
    return `<h1 class="pagetitle">My medal case</h1>
    <div class="rack big">${D.MONTHS.map(m => { const md = C.medal('me', m.id); return `<a href="#/student/event/${m.id}" class="rack-i">${medalSVG(md.tier, 64)}<b>${esc(m.event)}</b><span>${md.tier ? md.tier : md.done + '/' + md.total}</span></a>`; }).join('')}</div>
    <h2 class="sec">Tier ladder</h2><div class="ladder">${D.TIERS.map((x, i) => `<div class="${i <= t.idx ? 'hit' : ''}"><b>${x.n}</b><span>${x.min} pts</span></div>`).join('')}</div>
    <h2 class="sec">Badges</h2><div class="badges">${C.badges('me').map(b => `<div class="bdg ${b.ok ? 'ok' : ''}"><div>${b.e}</div><b>${b.n}</b><span>${b.d}</span></div>`).join('')}</div>`;
  }

  function stuPrizes() {
    const st = S(), bal = C.balance('me');
    return `<h1 class="pagetitle">Prize Locker</h1><p class="lead">You have <b>⭐ ${bal.toLocaleString()}</b> points to spend. Medals and tiers are never lost when you spend points.</p>
    <div class="prize-grid">${C.allPrizes().map(p => `<div class="prize"><div class="pi">${p.icon}</div><b>${esc(p.name)}</b><span class="small">${esc(p.tag)}</span><div class="pc">⭐ ${p.cost}</div><button class="btn sm ${bal >= p.cost ? 'gold' : ''}" data-a="redeem" data-id="${p.id}" ${bal >= p.cost ? '' : 'disabled'}>${bal >= p.cost ? 'Redeem' : 'Need ' + (p.cost - bal) + ' more'}</button></div>`).join('')}</div>
    <h2 class="sec">My requests</h2>${st.redeem.filter(r => r.sid === 'me').length ? `<ul class="plain">${st.redeem.filter(r => r.sid === 'me').map(r => `<li>${esc(r.name)} · ${r.cost} pts · <span class="tag ${r.st === 'approved' ? 'ok' : 'wait'}">${r.st === 'pending' ? 'Waiting for counselor' : r.st}</span></li>`).join('')}</ul>` : '<p class="small">No requests yet.</p>'}`;
  }

  // ---------- Activity modal ----------
  function fieldHTML(f) {
    if (f.t === 'ta') return `<label>${esc(f.l)}<textarea name="${f.k}" rows="3" placeholder="${esc(f.ph || '')}" required></textarea></label>`;
    if (f.t === 'tx') return `<label>${esc(f.l)}<input name="${f.k}" placeholder="${esc(f.ph || '')}" required></label>`;
    if (f.t === 'ck') return `<fieldset><legend>${esc(f.l)}</legend>${f.o.map((o, i) => `<label class="ckl"><input type="checkbox" name="${f.k}_${i}" required> ${esc(o)}</label>`).join('')}</fieldset>`;
    if (f.t === 'rows') return `<fieldset><legend>Fill in all ${f.n}</legend>${Array.from({ length: f.n }, (_, i) => `<div class="rowf">${f.cols.map(c => `<label>${esc(c.l)} ${i + 1}<input ${c.t === 'dt' ? 'type="date"' : ''} name="${f.k}_${i}_${c.k}" required></label>`).join('')}</div>`).join('')}</fieldset>`;
    return '';
  }

  function modalHTML() {
    const m = ui.modal; if (!m) return '';
    const a = m.act;
    return `<div class="overlay" data-a="close-modal"><form class="modal" data-submit="act" role="dialog" aria-modal="true" aria-label="${esc(a.title)}">
      <button type="button" class="x" data-a="close-modal" aria-label="Close">✕</button>
      <span class="eyebrow">+${a.pts} POINTS${a.verify ? ' · COUNSELOR CHECKS IT' : ''}</span><h2>${esc(a.title)}</h2>
      ${a.lesson ? `<p class="coach"><b>Coach's note:</b> ${esc(a.lesson)}</p>` : (a.desc ? `<p class="coach">${esc(a.desc)}</p>` : '')}
      ${a.link ? `<p><a href="${esc(a.link)}" target="_blank" rel="noopener">Open the resource ↗</a></p>` : ''}
      ${(a.fields || []).map(fieldHTML).join('')}
      <div class="mb"><button type="button" class="btn ghost" data-a="close-modal">Cancel</button><button class="btn gold">${a.verify ? 'Submit for review' : 'Complete +' + a.pts}</button></div>
    </form></div>`;
  }

  // ---------- Admin ----------
  function pendingItems() {
    const out = [], st = S();
    Object.keys(st.comp).forEach(sid => Object.entries(st.comp[sid]).forEach(([k, c]) => { if (c.st === 'pending') out.push({ sid, key: k, c }); }));
    return out.sort((a, b) => a.c.ts - b.c.ts);
  }
  const stuName = (sid) => (S().students.find(s => s.id === sid) || { name: '?' }).name;

  function admDash() {
    const st = S(), ss = st.students.filter(s => !s.archived);
    const active = ss.filter(s => Object.values(st.comp[s.id] || {}).some(c => c.st === 'done'));
    const rate = Math.round(active.length / ss.length * 100);
    const totalPts = ss.reduce((s, x) => s + C.lifetime(x.id), 0);
    const medals = { gold: 0, silver: 0, bronze: 0 };
    ss.forEach(s => D.MONTHS.forEach(m => { const t = C.medal(s.id, m.id).tier; if (t) medals[t]++; }));
    const ci = C.curIdx();
    const evBars = D.MONTHS.map((m, i) => {
      const tot = ss.length * m.activities.length, d = ss.reduce((s, x) => s + m.activities.filter(a => C.done(x.id, a.id)).length, 0);
      return { l: m.name.slice(0, 3), v: i > ci ? 0 : Math.round(d / tot * 100), lock: i > ci };
    });
    const gradeBars = [9, 10, 11, 12].map(g => { const gs = ss.filter(s => s.grade === g); const a = gs.filter(s => Date.now() - C.lastActive(s.id) < 30 * C.DAY).length; return { l: 'Gr ' + g, v: gs.length ? Math.round(a / gs.length * 100) : 0, n: gs.length }; });
    const stale = ss.filter(s => Date.now() - C.lastActive(s.id) > 30 * C.DAY).sort((a, b) => C.lastActive(a.id) - C.lastActive(b.id));
    const goal = +st.intake.goalPct || 0;
    const pend = pendingItems().length + st.accounts.length + st.redeem.filter(r => r.st === 'pending').length;
    const bars = (arr, unit) => `<div class="bars">${arr.map(b => `<div class="bar ${b.lock ? 'lock' : ''}"><i style="height:${Math.max(b.v, 2)}%"></i><b>${b.lock ? '-' : b.v + unit}</b><span>${b.l}</span></div>`).join('')}</div>`;
    return `<h1>Dashboard</h1><p class="sub">${esc(SCHOOL)} · sample data</p>
    ${pend ? `<a class="alert" href="#/admin/approvals">✅ ${pend} item${pend > 1 ? 's' : ''} waiting for you: account requests, verifications, prize requests →</a>` : ''}
    <div class="kpis"><div class="kpi"><b>${rate}%</b><span>participation (${active.length} of ${ss.length} students)</span></div>
      <div class="kpi"><b>${totalPts.toLocaleString()}</b><span>points earned</span></div>
      <div class="kpi"><b>🥇${medals.gold} 🥈${medals.silver} 🥉${medals.bronze}</b><span>medals earned</span></div>
      <div class="kpi"><b>${goal ? Math.min(100, Math.round(rate / goal * 100)) + '%' : 'n/a'}</b><span>${goal ? 'of your first-semester goal (' + goal + '% participation)' : 'set a goal in School Readiness'}</span></div></div>
    <div class="grid2"><div class="card"><h3>Completion by event</h3>${bars(evBars, '%')}</div>
      <div class="card"><h3>Active in last 30 days, by grade</h3>${bars(gradeBars, '%')}</div></div>
    <div class="card"><h3>Needs a nudge <small>${stale.length} students inactive 30+ days</small></h3>
      ${stale.length ? `<ul class="plain">${stale.slice(0, 6).map(s => `<li>${esc(s.name)} · grade ${s.grade} · last active ${ago(C.lastActive(s.id))}</li>`).join('')}</ul><p class="small">Tip: mention this month's event in advisory, or send the activation kit.</p>` : '<p>Everyone has been active recently. 🎉</p>'}
      <a class="btn sm" href="#/admin/kit">Open this month's activation kit</a></div>`;
  }

  function admApprovals() {
    const st = S(), p = pendingItems(), rd = st.redeem.filter(r => r.st === 'pending');
    return `<h1>Approvals</h1><p class="sub">Quick yes/no. Approving adds the points instantly.</p>
    <div class="card"><h3>Account requests <small>${st.accounts.length}</small></h3>${st.accounts.length ? `<table><tr><th>Student</th><th>Grade</th><th>Email</th><th></th></tr>${st.accounts.map(a => `<tr><td>${esc(a.name)}</td><td>${a.grade}</td><td>${esc(a.email)}</td><td class="r"><button class="btn sm" data-a="acc-ok" data-id="${a.id}">Approve</button> <button class="btn sm ghost" data-a="acc-no" data-id="${a.id}">Decline</button></td></tr>`).join('')}</table>` : '<p class="small">No account requests.</p>'}</div>
    <div class="card"><h3>Activity verifications <small>${p.length}</small></h3>${p.length ? `<table><tr><th>Student</th><th>Activity</th><th>Submitted</th><th>Details</th><th></th></tr>${p.map(x => { const a = C.actById(x.c.act || x.key); return `<tr><td>${esc(stuName(x.sid))}</td><td>${esc(a.title)} <small>+${x.c.pts}</small></td><td>${ago(x.c.ts)}</td><td class="det">${esc(Object.values(x.c.data || {}).join(' | ').slice(0, 140))}</td><td class="r"><button class="btn sm" data-a="ver-ok" data-sid="${x.sid}" data-key="${x.key}">Approve</button> <button class="btn sm ghost" data-a="ver-no" data-sid="${x.sid}" data-key="${x.key}">Try again</button></td></tr>`; }).join('')}</table>` : '<p class="small">Nothing to verify.</p>'}</div>
    <div class="card"><h3>Prize requests <small>${rd.length}</small></h3>${rd.length ? `<table>${rd.map(r => `<tr><td>${esc(stuName(r.sid))}</td><td>${esc(r.name)} · ${r.cost} pts</td><td class="r"><button class="btn sm" data-a="red-ok" data-id="${r.id}">Mark fulfilled</button> <button class="btn sm ghost" data-a="red-no" data-id="${r.id}">Decline</button></td></tr>`).join('')}</table>` : '<p class="small">No prize requests.</p>'}</div>`;
  }

  function admStudents() {
    const st = S(), q = ui.stuQ.toLowerCase();
    const rows = st.students.filter(s => (ui.stuGrade === 'all' || s.grade === +ui.stuGrade) && s.name.toLowerCase().includes(q));
    return `<h1>Students & Points</h1><p class="sub">Award points for things you see in person: tabling, assemblies, service, UCAW.</p>
    <div class="card"><h3>Award points</h3><form class="inline" data-submit="award"><select name="sid" required><option value="">Choose student</option>${st.students.map(s => `<option value="${s.id}">${esc(s.name)} (gr ${s.grade})</option>`).join('')}</select>
      <input name="pts" type="number" min="1" max="500" placeholder="Points" required><input name="reason" placeholder="Reason, e.g. helped at UCAW table" required><button class="btn">Award</button></form></div>
    <div class="card"><div class="toolbar"><input data-input="stuq" value="${esc(ui.stuQ)}" placeholder="Search students" aria-label="Search students"><select data-change="stug"><option value="all">All grades</option>${[9, 10, 11, 12].map(g => `<option ${ui.stuGrade == g ? 'selected' : ''}>${g}</option>`).join('')}</select><button class="btn sm ghost" data-a="csv">Download CSV</button></div>
      <table><tr><th>Student</th><th>Grade</th><th>Points</th><th>Tier</th><th>Medals</th><th>Last active</th></tr>${rows.map(s => { const md = D.MONTHS.map(m => C.medal(s.id, m.id).tier).filter(Boolean).length; return `<tr><td>${esc(s.name)}</td><td>${s.grade}</td><td>${C.lifetime(s.id).toLocaleString()}</td><td>${C.tier(s.id).name}</td><td>${md}</td><td>${ago(C.lastActive(s.id))}</td></tr>`; }).join('')}</table></div>`;
  }

  const INTAKE = [
    ['1. Leadership & ownership', 'Identify the executive sponsor, school point of contact, and support team.', [['sponsor', 'Executive sponsor (name, role)', 'tx'], ['poc', 'School point of contact (name, email)', 'tx'], ['team', 'Support team', 'tx']]],
    ['2. Student audience', 'Define the target student group and starting grade level.', [['grades', 'Target grades', 'ck', ['9', '10', '11', '12']], ['count', 'About how many students?', 'num']]],
    ['3. School integration', 'Where will students first hear about it? Advisory, CCR, CTE, counseling.', [['where', 'Existing opportunities to use', 'ck', ['Advisory', 'CCR', 'CTE classes', 'Counseling office', 'Homeroom']], ['whoLeads', 'Which teachers or counselors will introduce it?', 'tx']]],
    ['4. Communication & access', 'Confirm promotional channels, student logins, technology support, and approvals.', [['channels', 'Promotion channels', 'ck', ['Canvas / LMS', 'Morning announcements', 'Posters & school screens', 'Social media', 'Parent newsletter']], ['logins', 'Student logins ready?', 'sel', ['Yes', 'In progress', 'No']], ['tech', 'Technology support contact', 'tx'], ['approvals', 'Approvals needed before launch', 'tx']]],
    ['5. First-semester goal', 'Set a measurable participation target.', [['goalPct', 'Target: % of students active by end of fall semester', 'num'], ['goalNote', 'Note on how you will measure it', 'tx']]]
  ];
  const REQ = ['sponsor', 'poc', 'team', 'grades', 'count', 'where', 'whoLeads', 'channels', 'logins', 'tech', 'approvals', 'goalPct'];
  const filled = (k) => { const v = S().intake[k]; return Array.isArray(v) ? v.length > 0 : v !== undefined && String(v).trim() !== ''; };
  const readyPct = () => Math.round(REQ.filter(filled).length / REQ.length * 100);

  function admReadiness() {
    const st = S(), iv = st.intake;
    const field = ([k, l, t, o]) => {
      if (t === 'ck') return `<fieldset><legend>${esc(l)}</legend>${o.map(x => `<label class="ckl"><input type="checkbox" data-intake="${k}" value="${esc(x)}" ${(iv[k] || []).includes(x) ? 'checked' : ''}> ${esc(x)}</label>`).join('')}</fieldset>`;
      if (t === 'sel') return `<label>${esc(l)}<select data-intake="${k}"><option value="">Choose</option>${o.map(x => `<option ${iv[k] === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>`;
      return `<label>${esc(l)}<input data-intake="${k}" ${t === 'num' ? 'type="number" min="0"' : ''} value="${esc(iv[k] || '')}"></label>`;
    };
    const tab = ui.intakeTab;
    const plan = () => `<div class="plan printable"><h2>${esc(SCHOOL)}: Champion Schools 34 implementation plan</h2><p class="sub">One-page plan · prepared ${new Date().toLocaleDateString()}</p>
      <table class="kv"><tr><th>Executive sponsor</th><td>${esc(iv.sponsor || 'To be named')}</td></tr><tr><th>School point of contact</th><td>${esc(iv.poc || 'To be named')}</td></tr><tr><th>Support team</th><td>${esc(iv.team || 'To be named')}</td></tr>
      <tr><th>Student audience</th><td>Grades ${esc((iv.grades || []).join(', ') || '?')} · about ${esc(iv.count || '?')} students</td></tr>
      <tr><th>School integration</th><td>${esc((iv.where || []).join(', ') || '?')}. Led by: ${esc(iv.whoLeads || '?')}</td></tr>
      <tr><th>Promotion channels</th><td>${esc((iv.channels || []).join(', ') || '?')}</td></tr>
      <tr><th>Student logins</th><td>${esc(iv.logins || '?')} · Tech contact: ${esc(iv.tech || '?')}</td></tr>
      <tr><th>Approvals before launch</th><td>${esc(iv.approvals || 'None listed')}</td></tr>
      <tr><th>First-semester goal</th><td>${esc(iv.goalPct || '?')}% of students active. ${esc(iv.goalNote || '')}</td></tr></table>
      <h3>Monthly rhythm</h3><p>Each month: introduce the event through your channels, send the activation kit, approve verifications, and award points. Midyear check-in in January; impact report in May.</p></div>`;
    return `<h1>School Readiness</h1><p class="sub">The 5-part intake before launch. The outcome is a one-page school implementation plan.</p>
    <div class="meter"><i style="width:${readyPct()}%" id="rm"></i></div><p class="small"><b id="rp">${readyPct()}%</b> of required items complete</p>
    <div class="tabs light"><button class="${tab === 'form' ? 'on' : ''}" data-a="itab" data-t="form">Intake form</button><button class="${tab === 'plan' ? 'on' : ''}" data-a="itab" data-t="plan">One-page plan</button></div>
    ${tab === 'form' ? INTAKE.map(sec => `<div class="card"><h3>${sec[0]}</h3><p class="small">${sec[1]}</p>${sec[2].map(field).join('')}</div>`).join('') : plan() + `<button class="btn" data-a="print">Print or save as PDF</button>`}`;
  }

  function kitFor(m) {
    const acts = m.activities.map(a => a.title).join('; ');
    const pts = m.activities.reduce((s, a) => s + a.pts, 0);
    return {
      canvas: `🏅 ${m.name} event: ${m.event}!\nThis month's Olympic value is ${m.value}, and our focus is "${m.initiative}". ${m.tagline}\nTo compete, log in to Champion Schools 34 and complete: ${acts}.\nYou can earn up to ${pts} points and a medal. Prize: ${m.prize}.\nStart here: ${PLATFORM_URL}`,
      morning: `Good morning, ${SCHOOL}! This month we are competing in the ${m.event}. The Olympic value is ${m.value}. Log in to Champion Schools 34, finish an activity, and earn points toward a medal.`,
      cta: `Log in today and earn up to ${pts} points in the ${m.event}.`,
      teacher: `One-minute teacher talk. This month's value is ${m.value}. Ask students: when did you last show ${m.value.toLowerCase()}? Then connect it to the month's focus, "${m.initiative}": ${m.tagline} Show the Champion Schools 34 page, point out this month's event, and give students two minutes to start the first activity: ${m.activities[0].title}.`,
      parent: `This month in Champion Schools 34: ${m.event}. Our students are practicing ${m.value} and working on "${m.initiative}". ${m.tagline} Ask your student what they are working on. Families can help with the activities and talk about plans after high school.`,
      ambassador: `Student ambassador script (30 sec). Hey! I'm ___. This month in Champion Schools 34 we're doing the ${m.event}. It's about ${m.value}. I already did ${m.activities[0].title.toLowerCase()} and it took about ${m.activities[0].mins || 10} minutes. You get points and a shot at ${m.prize}. Scan the poster or check Canvas to start.`,
      recog: `Recognition: announce medal winners at morning announcements and the school screens, give out the ${m.event} prize (${m.prize}), and tag winners on the Ken Garff for Good Instagram with permission.`
    };
  }

  function admKit() {
    const st = S(), ci = C.curIdx();
    const m = monthById(ui.kitMonth) || D.MONTHS[ci < 9 ? ci : 0], kit = kitFor(m), done = st.checks.kit;
    const blocks = [['canvas', 'Canvas / school-wide message', kit.canvas], ['morning', 'Morning announcement', kit.morning], ['cta', 'Student call to action', kit.cta], ['teacher', 'One-minute teacher talk', kit.teacher], ['parent', 'Parent newsletter blurb', kit.parent], ['ambassador', 'Optional student ambassador script', kit.ambassador], ['recog', 'Initiative & recognition details', kit.recog]];
    return `<h1>Monthly Activation Kit</h1><p class="sub">Ready to use. Promoting Champion Schools 34 should take minutes, not hours.</p>
    <div class="toolbar"><select data-change="kitm">${D.MONTHS.map(x => `<option value="${x.id}" ${x.id === m.id ? 'selected' : ''}>${x.name}: ${x.event}</option>`).join('')}</select><button class="btn sm ghost" data-a="dl-kit" data-m="${m.id}">Download kit (.txt)</button></div>
    <div class="card poster-card"><h3>Poster (print or show on school screens)</h3>
      <div class="poster printable" style="--ev:${m.color}"><div class="p-ic">${m.icon}</div><small>${m.name.toUpperCase()} · CHAMPION SCHOOLS 34</small><h2>${esc(m.event)}</h2><p class="pv">${esc(m.value)}</p><p>${esc(m.initiative)}: ${esc(m.tagline)}</p><ul>${m.activities.map(a => `<li>${esc(a.title)} <b>+${a.pts}</b></li>`).join('')}</ul><p class="pp">🎁 ${esc(m.prize)}</p><p class="pu">Join at ${PLATFORM_URL.replace('https://', '')}</p></div>
      <button class="btn sm" data-a="print">Print poster</button></div>
    ${blocks.map(b => `<div class="card kit"><label class="ckl"><input type="checkbox" data-kit="${m.id}-${b[0]}" ${done[m.id + '-' + b[0]] ? 'checked' : ''}> <b>${b[1]}</b></label><pre>${esc(b[2])}</pre><button class="btn sm ghost" data-a="copy" data-k="${b[0]}" data-m="${m.id}">Copy</button></div>`).join('')}`;
  }

  function admOnboarding() {
    const st = S(), ck = st.checks;
    const launch = st.launch ? new Date(st.launch + 'T12:00:00') : null;
    return `<h1>Onboarding & Calendar</h1><p class="sub">One playbook, every school: Prepare, Equip, Launch, Sustain.</p>
    <h2 class="sec2">Role-based onboarding</h2><div class="grid2">${D.ONBOARDING.map((o, i) => { const n = o.steps.filter((_, j) => ck.onb[i + '-' + j]).length; return `<div class="card"><h3>${o.icon} ${o.role}</h3><p class="small">${o.length} · ${o.goal}</p><div class="vid">▶ Video script outline<ul>${o.video.map(v => `<li>${esc(v)}</li>`).join('')}</ul></div>
      ${o.steps.map((s, j) => `<label class="ckl"><input type="checkbox" data-onb="${i}-${j}" ${ck.onb[i + '-' + j] ? 'checked' : ''}> ${esc(s)}</label>`).join('')}<div class="meter sm"><i style="width:${n / o.steps.length * 100}%"></i></div></div>`; }).join('')}</div>
    <h2 class="sec2">Implementation calendar</h2><div class="card"><label>Launch date <input type="date" data-launch value="${st.launch || ''}"></label>
      ${D.CALENDAR.map((p, i) => { const dt = launch ? new Date(launch.getTime() + p.offsetDays * C.DAY).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''; return `<div class="phase"><h4><span class="ph">${p.phase}</span> ${p.when} ${dt && p.offsetDays <= 0 ? '<em>target: ' + dt + '</em>' : ''}</h4>${p.tasks.map((t, j) => `<label class="ckl"><input type="checkbox" data-cal="${i}-${j}" ${ck.cal[i + '-' + j] ? 'checked' : ''}> ${esc(t)}</label>`).join('')}</div>`; }).join('')}</div>`;
  }

  function admPrizes() {
    const st = S();
    return `<h1>School Prizes</h1><p class="sub">Students in rural schools told Ken Garff for Good that prizes three hours away don't motivate them. Add prizes your students actually want.</p>
    <div class="card"><h3>Add a school prize</h3><form class="inline" data-submit="prize"><input name="name" placeholder="Prize, e.g. Front-row parking spot" required><input name="cost" type="number" min="50" max="2000" placeholder="Point cost" required><input name="tag" placeholder="How it's delivered, e.g. At school" required><button class="btn">Add</button></form></div>
    <div class="card"><h3>Prize catalog</h3><table><tr><th></th><th>Prize</th><th>Cost</th><th>Delivery</th></tr>${C.allPrizes().map(p => `<tr><td>${p.icon}</td><td>${esc(p.name)}</td><td>${p.cost}</td><td>${esc(p.tag)}</td></tr>`).join('')}</table><p class="small">The statewide prizes are placeholders that Ken Garff for Good would confirm.</p></div>`;
  }

  // ---------- Router ----------
  function route() {
    const st = S(), h = location.hash.replace(/^#\/?/, '').split('/'), root = $('#app'), area = h[0], page = h[1] || '', arg = h[2];
    let html;
    if (area === 'student') {
      st.role = 'student';
      const views = { home: stuHome, events: stuEvents, podium: stuPodium, medals: stuMedals, prizes: stuPrizes };
      const inner = views[page] ? views[page]() : page === 'event' ? stuEvent(arg) : stuHome();
      html = studentShell(inner, page === 'event' ? 'events' : (views[page] ? page : 'home'));
    } else if (area === 'admin') {
      const pg = { dashboard: admDash, approvals: admApprovals, students: admStudents, readiness: admReadiness, kit: admKit, onboarding: admOnboarding, prizes: admPrizes };
      html = adminShell((pg[page] || admDash)(), pg[page] ? page : 'dashboard');
    } else html = landing();
    root.innerHTML = html;
    $('#modal').innerHTML = modalHTML();
    document.title = 'Champion Schools 34';
    window.scrollTo(0, 0);
  }
  const rerender = () => { const y = window.scrollY; const f = document.activeElement; route(); window.scrollTo(0, y); };

  // ---------- Effects ----------
  function toast(msg) {
    let t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 3200);
  }
  function confetti() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = document.createElement('div'); box.className = 'confetti'; box.setAttribute('aria-hidden', 'true');
    const cols = ['#F5C542', '#E4002B', '#1E6BFF', '#19C37D', '#fff'];
    for (let i = 0; i < 46; i++) { const p = document.createElement('i'); p.style.cssText = `left:${Math.random() * 100}%;background:${cols[i % 5]};animation-delay:${Math.random() * .4}s;animation-duration:${1.4 + Math.random()}s`; box.appendChild(p); }
    document.body.appendChild(box); setTimeout(() => box.remove(), 2600);
  }

  function collect(form) {
    const data = {}, fd = new FormData(form);
    for (const [k, v] of fd.entries()) data[k] = v;
    return data;
  }

  function csv() {
    const st = S(), rows = [['Name', 'Grade', 'Points', 'Tier', 'Medals', 'Last active']].concat(st.students.map(s => [s.name, s.grade, C.lifetime(s.id), C.tier(s.id).name, D.MONTHS.filter(m => C.medal(s.id, m.id).tier).length, C.lastActive(s.id) ? new Date(C.lastActive(s.id)).toISOString().slice(0, 10) : '']));
    return rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
  }
  function download(name, text, type) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type || 'text/plain' })); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  }

  // ---------- Events ----------
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-a]'); if (!el) return;
    const a = el.dataset.a, st = S();
    if (a === 'close-modal') { if (e.target !== el && el.classList.contains('overlay')) return; ui.modal = null; $('#modal').innerHTML = ''; return; }
    if (a === 'login-admin') { st.role = 'admin'; C.save(); return; }
    if (a === 'as-student') { st.role = 'student'; return; }
    if (a === 'logout') { st.role = null; C.save(); return; }
    if (a === 'reset') { if (confirm('Reset all demo data?')) { C.reset(); location.hash = '#/'; rerender(); } return; }
    if (a === 'open-act') { const act = C.actById(el.dataset.id); let m = act; if (act.alt && st.me.grade < 12) m = { ...act, title: act.alt.title, lesson: act.alt.lesson, fields: act.alt.fields }; ui.modal = { act: m }; $('#modal').innerHTML = modalHTML(); const f = $('.modal input,.modal textarea,.modal .btn.gold'); if (f) f.focus(); return; }
    if (a === 'daily') { const act = C.actById('k_daily'); const r = C.submit('me', act, {}); toast('Warmed up! +10 points. 🔥 ' + C.streak('me') + '-day streak'); rerender(); return; }
    if (a === 'dismiss-notices') { st.notices.forEach(n => { if (n.sid === 'me') n.seen = true; }); C.save(); rerender(); return; }
    if (a === 'pod') { ui.podTab = el.dataset.t; rerender(); return; }
    if (a === 'redeem') { const p = C.allPrizes().find(x => x.id === el.dataset.id); if (p && C.balance('me') >= p.cost) { st.redeem.push({ id: 'r' + Date.now(), sid: 'me', prizeId: p.id, name: p.name, cost: p.cost, st: 'pending', ts: Date.now() }); C.save(); toast('Requested! Your counselor will follow up.'); rerender(); } return; }
    if (a === 'acc-ok' || a === 'acc-no') { const i = st.accounts.findIndex(x => x.id === el.dataset.id); if (i > -1) { const acc = st.accounts.splice(i, 1)[0]; if (a === 'acc-ok') { const nid = 's' + Date.now(); st.students.push({ id: nid, name: acc.name, grade: acc.grade }); st.comp[nid] = {}; } C.save(); toast(a === 'acc-ok' ? 'Account approved' : 'Request declined'); rerender(); } return; }
    if (a === 'ver-ok' || a === 'ver-no') { let reason = ''; if (a === 'ver-no') reason = prompt('Optional note for the student (what to fix):') || ''; C.decide(el.dataset.sid, el.dataset.key, a === 'ver-ok', reason); toast(a === 'ver-ok' ? 'Approved: points awarded' : 'Sent back to the student'); rerender(); return; }
    if (a === 'red-ok' || a === 'red-no') { const r = st.redeem.find(x => x.id === el.dataset.id); if (r) { r.st = a === 'red-ok' ? 'approved' : 'declined'; st.notices.push({ sid: r.sid, t: (a === 'red-ok' ? 'Prize ready: ' : 'Prize request declined: ') + r.name, ts: Date.now() }); C.save(); rerender(); } return; }
    if (a === 'csv') { download('champion-schools-34-students.csv', csv(), 'text/csv'); return; }
    if (a === 'itab') { ui.intakeTab = el.dataset.t; rerender(); return; }
    if (a === 'print') { window.print(); return; }
    if (a === 'copy') { const t = kitFor(monthById(el.dataset.m))[el.dataset.k]; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast('Copied'), () => toast('Select the text and copy it')); return; }
    if (a === 'dl-kit') { const m = monthById(el.dataset.m), k = kitFor(m); download('cs34-' + m.id + '-activation-kit.txt', m.name + ': ' + m.event + '\n\n' + Object.entries(k).map(([n, t]) => n.toUpperCase() + '\n' + t).join('\n\n')); return; }
  });

  document.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-submit]'); if (!f) return; e.preventDefault();
    const k = f.dataset.submit, st = S();
    if (k === 'login-student') { const d = collect(f); st.me = { name: (d.name || 'Alex').trim().slice(0, 20), grade: +d.grade }; const m = st.students.find(s => s.id === 'me'); m.name = st.me.name + ' (you)'; m.grade = st.me.grade; st.role = 'student'; C.save(); location.hash = '#/student/home'; return; }
    if (k === 'act') {
      const act = ui.modal.act, before = {}; D.MONTHS.forEach(m => before[m.id] = C.medal('me', m.id).tier);
      const r = C.submit('me', act, collect(f)); ui.modal = null;
      const mo = D.MONTHS.find(m => m.activities.some(a => a.id === act.id)), after = mo ? C.medal('me', mo.id).tier : null;
      toast(r === 'pending' ? 'Submitted! Your counselor will check it.' : '+' + act.pts + ' points!' + (after && after !== before[mo.id] ? ' 🏅 ' + after + ' medal!' : ''));
      if (r === 'done') confetti();
      rerender(); return;
    }
    if (k === 'award') { const d = collect(f); C.award(d.sid, d.pts, d.reason); toast('Awarded ' + d.pts + ' points'); rerender(); return; }
    if (k === 'prize') { const d = collect(f); st.prizesCustom.push({ id: 'c' + Date.now(), name: d.name, cost: +d.cost, tag: d.tag, icon: '⭐' }); C.save(); rerender(); return; }
  });

  document.addEventListener('change', (e) => {
    const t = e.target, st = S();
    if (t.dataset.change === 'clock') { st.clock = +t.value; C.save(); rerender(); }
    else if (t.dataset.change === 'stug') { ui.stuGrade = t.value; rerender(); }
    else if (t.dataset.change === 'kitm') { ui.kitMonth = t.value; rerender(); }
    else if (t.dataset.kit) { st.checks.kit[t.dataset.kit] = t.checked; C.save(); }
    else if (t.dataset.onb) { st.checks.onb[t.dataset.onb] = t.checked; C.save(); rerender(); }
    else if (t.dataset.cal) { st.checks.cal[t.dataset.cal] = t.checked; C.save(); }
    else if (t.hasAttribute('data-launch')) { st.launch = t.value; C.save(); rerender(); }
    else if (t.dataset.intake) { intakeSet(t); }
  });
  document.addEventListener('input', (e) => {
    const t = e.target;
    if (t.dataset.input === 'stuq') { ui.stuQ = t.value; const pos = t.selectionStart; rerender(); const n = $('[data-input="stuq"]'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } }
    else if (t.dataset.intake && t.type !== 'checkbox' && t.tagName !== 'SELECT') intakeSet(t);
  });
  function intakeSet(t) {
    const st = S(), k = t.dataset.intake;
    if (t.type === 'checkbox') { const cur = new Set(st.intake[k] || []); t.checked ? cur.add(t.value) : cur.delete(t.value); st.intake[k] = Array.from(cur); }
    else st.intake[k] = t.value;
    C.save(); const p = readyPct(); const rp = $('#rp'), rm = $('#rm'); if (rp) rp.textContent = p + '%'; if (rm) rm.style.width = p + '%';
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && ui.modal) { ui.modal = null; $('#modal').innerHTML = ''; } });
  window.addEventListener('hashchange', route);

  C.load();
  route();
})();
