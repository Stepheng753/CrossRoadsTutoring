/* Math Hero Training — 3-part math game (multiplication, fractions, limits).
   Vanilla JS, no build step. State is saved to localStorage. */
(function () {
  'use strict';

  var LIVES_MAX = 10;
  var ROUND = 20;
  var KEY = 'crt_math_hero_v1';

  /* ---------- answer parsing / checking ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }

  function parse(raw) {
    var s = String(raw == null ? '' : raw).toUpperCase().replace(/\s+/g, '').replace(/−/g, '-').replace(/∞/g, 'INF');
    if (s === 'DNE') return { t: 'dne' };
    if (s === 'INF' || s === '+INF') return { t: 'inf', s: 1 };
    if (s === '-INF') return { t: 'inf', s: -1 };
    var m = /^([+-]?\d+)(?:\/([+-]?\d+))?$/.exec(s);
    if (!m) return null;
    var n = parseInt(m[1], 10), d = m[2] === undefined ? 1 : parseInt(m[2], 10);
    if (d === 0) return null;
    if (d < 0) { n = -n; d = -d; }
    return { t: 'frac', n: n, d: d };
  }

  // returns {ok, hint}
  function check(input, answer) {
    var p = parse(input), a = parse(answer);
    if (!p) return { ok: false, hint: 'Use a number, a fraction like 3/4, INF, -INF or DNE.' };
    if (p.t !== a.t) return { ok: false };
    if (p.t === 'dne') return { ok: true };
    if (p.t === 'inf') return { ok: p.s === a.s };
    if (p.n * a.d !== a.n * p.d) return { ok: false };
    if (gcd(p.n, p.d) !== 1 && !(p.n === 0 && p.d === 1)) return { ok: false, hint: 'Right value, but reduce your fraction all the way!' };
    return { ok: true };
  }

  /* ---------- generators ---------- */
  function rnd(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function frac(n, d) { var g = gcd(n, d) || 1; if (d < 0) { n = -n; d = -d; } return { n: n / g, d: d / g }; }
  function F(n, d) { return '<span class="frac"><span>' + n + '</span><span>' + d + '</span></span>'; }
  function S(x) { return '<span class="rad">√<span class="rt">' + x + '</span></span>'; }
  function fmt(f) { return f.d === 1 ? String(f.n) : f.n + '/' + f.d; }

  function genMult() {
    var a = rnd(1, 12), b = rnd(1, 12);
    return { kind: 'mult', html: '<div class="big">' + a + ' × ' + b + ' = ?</div>',
      text: a + ' × ' + b, labels: ['Answer'], answers: [String(a * b)] };
  }

  function genFrac() {
    var ops = ['+', '−', '×', '÷'];
    for (var tries = 0; tries < 1000; tries++) {
      var d1 = rnd(1, 12), d2 = rnd(1, 12);
      var n1 = rnd(1, 2 * d1), n2 = rnd(1, 2 * d2), op = ops[rnd(0, 3)];
      var res;
      if (op === '+') res = frac(n1 * d2 + n2 * d1, d1 * d2);
      else if (op === '−') res = frac(n1 * d2 - n2 * d1, d1 * d2);
      else if (op === '×') res = frac(n1 * n2, d1 * d2);
      else res = frac(n1 * d2, d1 * n2);
      if (res.n === 0 || res.n / res.d < -3 || res.n / res.d > 3) continue;
      return { kind: 'frac',
        html: '<div class="big">' + F(n1, d1) + '<span class="op">' + op + '</span>' + F(n2, d2) + '<span class="op">=</span>?</div>',
        text: n1 + '/' + d1 + ' ' + op + ' ' + n2 + '/' + d2, labels: ['Answer'], answers: [fmt(res)] };
    }
    return genMult();
  }

  /* ---------- limits bank ---------- */
  function lim(sub, body) {
    return '<div class="lim"><span class="limword">lim<sub>' + sub + '</sub></span><span class="expr">' + body + '</span></div>';
  }
  function cases(rows) {
    return '<div class="cases">' + rows.map(function (r) { return '<div>' + r[0] + '<span class="cond">' + r[1] + '</span></div>'; }).join('') + '</div>';
  }
  var LEFT = function (c) { return 'from the left (x→' + c + '⁻)'; };
  var RIGHT = function (c) { return 'from the right (x→' + c + '⁺)'; };
  var ONE = [['Limit']];

  var LIMITS = [
    // plug-in / factor-and-cancel
    { type: 'Plug it in', html: lim('x→3', 'x<sup>2</sup> − 2x + 1'), text: 'lim x→3 (x^2 - 2x + 1)', labels: ['Limit'], answers: ['4'] },
    { type: 'Factor & cancel', html: lim('x→2', F('x<sup>2</sup> − 4', 'x − 2')), text: 'lim x→2 (x^2 - 4)/(x - 2)', labels: ['Limit'], answers: ['4'] },
    { type: 'Factor & cancel', html: lim('x→−1', F('x<sup>2</sup> + 3x + 2', 'x + 1')), text: 'lim x→-1 (x^2 + 3x + 2)/(x + 1)', labels: ['Limit'], answers: ['1'] },
    { type: 'Factor & cancel', html: lim('x→0', F('3x<sup>2</sup> + 5x', 'x')), text: 'lim x→0 (3x^2 + 5x)/x', labels: ['Limit'], answers: ['5'] },
    { type: 'Factor & cancel', html: lim('x→4', F('x − 4', 'x<sup>2</sup> − 16')), text: 'lim x→4 (x - 4)/(x^2 - 16)', labels: ['Limit'], answers: ['1/8'] },
    { type: 'Plug it in', html: lim('x→1', F('x + 3', '2x + 4')), text: 'lim x→1 (x + 3)/(2x + 4)', labels: ['Limit'], answers: ['2/3'] },
    { type: 'Plug it in', html: lim('x→5', S('x + 4')), text: 'lim x→5 sqrt(x + 4)', labels: ['Limit'], answers: ['3'] },
    // vertical asymptotes
    { type: 'Vertical asymptote', html: lim('x→2', F('1', 'x − 2')), text: 'lim x→2 1/(x - 2)', labels: [LEFT(2), RIGHT(2), 'overall limit'], answers: ['-INF', 'INF', 'DNE'] },
    { type: 'Vertical asymptote', html: lim('x→3', F('1', '(x − 3)<sup>2</sup>')), text: 'lim x→3 1/(x - 3)^2', labels: ['Limit'], answers: ['INF'] },
    { type: 'Vertical asymptote', html: lim('x→−1', F('x', '(x + 1)<sup>2</sup>')), text: 'lim x→-1 x/(x + 1)^2', labels: ['Limit'], answers: ['-INF'] },
    { type: 'Vertical asymptote', html: lim('x→1', F('x + 2', 'x − 1')), text: 'lim x→1 (x + 2)/(x - 1)', labels: [LEFT(1), RIGHT(1), 'overall limit'], answers: ['-INF', 'INF', 'DNE'] },
    // piecewise
    { type: 'Piecewise', html: 'f(x) = ' + cases([['x + 1', 'if x &lt; 2'], ['x<sup>2</sup> − 1', 'if x ≥ 2']]) + lim('x→2', 'f(x)'),
      text: 'f(x) = x+1 if x<2; x^2-1 if x>=2. lim x→2 f(x)', labels: [LEFT(2), RIGHT(2), 'overall limit'], answers: ['3', '3', '3'] },
    { type: 'Piecewise', html: 'f(x) = ' + cases([['2x', 'if x &lt; 1'], ['5 − x', 'if x ≥ 1']]) + lim('x→1', 'f(x)'),
      text: 'f(x) = 2x if x<1; 5-x if x>=1. lim x→1 f(x)', labels: [LEFT(1), RIGHT(1), 'overall limit'], answers: ['2', '4', 'DNE'] },
    { type: 'Piecewise', html: 'f(x) = ' + cases([['x<sup>2</sup>', 'if x ≤ −1'], ['3x + 4', 'if x &gt; −1']]) + lim('x→−1', 'f(x)'),
      text: 'f(x) = x^2 if x<=-1; 3x+4 if x>-1. lim x→-1 f(x)', labels: [LEFT(-1), RIGHT(-1), 'overall limit'], answers: ['1', '1', '1'] },
    { type: 'Piecewise', html: lim('x→0', F('|x|', 'x')), text: 'lim x→0 |x|/x', labels: [LEFT(0), RIGHT(0), 'overall limit'], answers: ['-1', '1', 'DNE'] },
    // horizontal asymptotes
    { type: 'Horizontal asymptote', html: lim('x→+∞', F('3x<sup>2</sup> + 1', 'x<sup>2</sup> − 5')), text: 'lim x→inf (3x^2 + 1)/(x^2 - 5)', labels: ['Limit'], answers: ['3'] },
    { type: 'Horizontal asymptote', html: lim('x→+∞', F('2x + 1', 'x<sup>2</sup> + 3')), text: 'lim x→inf (2x + 1)/(x^2 + 3)', labels: ['Limit'], answers: ['0'] },
    { type: 'Horizontal asymptote', html: lim('x→±∞', F('x<sup>3</sup> + 1', 'x<sup>2</sup> + 1')), text: 'lim x→±inf (x^3 + 1)/(x^2 + 1)', labels: ['x→+∞', 'x→−∞'], answers: ['INF', '-INF'] },
    { type: 'Double HA', html: lim('x→±∞', F(S('4x<sup>2</sup> + 1'), 'x + 3')), text: 'lim x→±inf sqrt(4x^2 + 1)/(x + 3)', labels: ['x→+∞', 'x→−∞'], answers: ['2', '-2'] },
    { type: 'Double HA', html: lim('x→±∞', F('3x', S('x<sup>2</sup> + 4'))), text: 'lim x→±inf 3x/sqrt(x^2 + 4)', labels: ['x→+∞', 'x→−∞'], answers: ['3', '-3'] }
  ];

  function limItem(i) {
    var q = LIMITS[i];
    return { kind: 'lim', id: i + 1, type: q.type, html: q.html, text: q.text, labels: q.labels, answers: q.answers };
  }

  /* ---------- state ---------- */
  var SECTIONS = { mult: 'Multiplication', frac: 'Fractions', lim: 'Limits' };
  var state;

  function fresh() {
    var s = { name: '', elapsed: 0, lives: LIVES_MAX, refills: 0, streak: 0, best: 0, tab: 'mult',
      sec: { mult: { items: [], cur: 0, start: 0 }, frac: { items: [], cur: 0, start: 0 }, lim: { items: [], cur: 0, start: 0 } } };
    for (var i = 0; i < ROUND; i++) { s.sec.mult.items.push(genMult()); s.sec.frac.items.push(genFrac()); s.sec.lim.items.push(limItem(i)); }
    return s;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }
  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) { var s = JSON.parse(raw); if (s && s.sec && s.sec.lim && s.sec.lim.items.length === ROUND) return s; } } catch (e) { /* ignore */ }
    return fresh();
  }

  function points(it) { return it.done && !it.skipped && it.attempts && it.attempts.length ? 1 / it.attempts.length : 0; }
  function secScore(k) { return state.sec[k].items.reduce(function (a, it) { return a + points(it); }, 0); }
  function totalScore() { return secScore('mult') + secScore('frac') + secScore('lim'); }
  function fmtTime(s) { var m = Math.floor(s / 60), r = s % 60; return m + ':' + (r < 10 ? '0' : '') + r; }
  function stamp(ms, withDate) {
    var o = { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true, timeZoneName: 'short' };
    if (withDate) { o.year = 'numeric'; o.month = 'short'; o.day = 'numeric'; }
    return new Date(ms).toLocaleString('en-US', o);
  }
  function fmtDur(s) { var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), r = s % 60; return (h ? h + 'h ' : '') + m + 'm ' + r + 's'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- pixel art ---------- */
  function pixels(map, pal, px) {
    var rects = '';
    map.forEach(function (row, y) { for (var x = 0; x < row.length; x++) { var c = pal[row[x]]; if (c) rects += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + c + '"/>'; } });
    return '<svg class="px" viewBox="0 0 ' + map[0].length + ' ' + map.length + '" width="' + map[0].length * px + '" height="' + map.length * px + '" shape-rendering="crispEdges" aria-hidden="true">' + rects + '</svg>';
  }
  var HERO = ['...BBB...', '..BBBBB..', '..BKSKB..', '..SSSSS..', 'R.BBYBB.R', 'RBBBYBBBR', 'RRBBBBBRR', '.R.BBB.R.', '...B.B...', '...B.B...', '..KK.KK..'];
  var ENEMIES = [
    { name: 'ROBO-BOT', px: { G: '#adb5bd', R: '#ff6b6b', K: '#343a40' }, map: ['..GGGGG..', '.GRGGGRG.', '.GGGGGGG.', '..GKKKG..', 'GGGGGGGGG', 'G.GGGGG.G', '..GGGGG..', '..GG.GG..', '..KK.KK..'] },
    { name: 'GHOULIE', px: { P: '#9775fa', W: '#fff', K: '#000' }, map: ['..PPPPP..', '.PPPPPPP.', 'PPWKPWKPP', 'PPPPPPPPP', 'PPPKKKPPP', 'PPPPPPPPP', 'PPPPPPPPP', 'PP.PPP.PP', 'P...P...P'] },
    { name: 'ALIEN-X', px: { G: '#51cf66', K: '#000' }, map: ['G.......G', '.G.GGG.G.', '..GGGGG..', '.GKGGGKG.', 'GGGGGGGGG', '..GKKKG..', '...GGG...', '.G.G.G.G.', 'G.......G'] },
    { name: 'SKULLY', px: { W: '#f1f3f5', K: '#212529' }, map: ['..WWWWW..', '.WWWWWWW.', 'WWKKWKKWW', 'WWKKWKKWW', 'WWWWKWWWW', '.WWWWWWW.', '..WKWKW..', '..WKWKW..', '.........'] }
  ];
  var HERO_PAL = { B: '#3b5bdb', K: '#222', S: '#ffcf9f', R: '#e03131', Y: '#ffd43b' };

  /* ---------- battle arena ---------- */
  var arenaItem = null, pendingItem = null, enemyCount = 0;
  function playAnim(id, cls, ms) {
    var el = $(id); if (!el) return;
    el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
    setTimeout(function () { el.classList.remove(cls); }, ms);
  }
  function updateArena(it) {
    if (arenaItem === it) return;
    arenaItem = it;
    var e = ENEMIES[(it.kind === 'lim' ? it.id : state.sec[state.tab].cur) % ENEMIES.length];
    var en = $('aEnemy');
    en.innerHTML = pixels(e.map, e.px, 7);
    en.classList.remove('ko', 'enter');
    void en.offsetWidth;
    en.classList.add(it.done && !it.skipped ? 'ko' : 'enter');
    $('eName').textContent = e.name; $('eName2').textContent = e.name;
    $('eHp').style.width = it.done && !it.skipped ? '0%' : '100%';
  }

  /* ---------- DOM ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var stage = $('stage'), fx = $('fx');

  function renderHud() {
    var pct = state.lives / LIVES_MAX * 100;
    ['hHp'].forEach(function (id) {
      var f = $(id); f.style.width = pct + '%';
      f.style.background = pct <= 30 ? '#e03131' : pct <= 60 ? '#fab005' : '#51cf66';
    });
    $('hpText').textContent = state.lives + '/' + LIVES_MAX;
    $('streak').textContent = state.streak;
    $('best').textContent = state.best;
    $('score').textContent = totalScore().toFixed(2);
    $('timer').textContent = fmtTime(state.elapsed);
    document.querySelectorAll('.tab').forEach(function (b) {
      var k = b.getAttribute('data-tab');
      b.classList.toggle('active', k === state.tab);
      b.setAttribute('aria-selected', k === state.tab ? 'true' : 'false');
      b.querySelector('.tab-score').textContent = secScore(k).toFixed(2);
    });
  }

  function roundItems(sec) { return sec.items.slice(sec.start, sec.start + ROUND); }
  function roundDone(sec) { return roundItems(sec).every(function (it) { return it.done; }); }

  function render() {
    renderHud();
    var sec = state.sec[state.tab], it = sec.items[sec.cur];
    updateArena(it);
    var html = '<div class="stage-top"><h2>' + SECTIONS[state.tab] + '</h2><div class="stage-meta">';

    if (state.tab === 'lim') {
      html += '<div class="qgrid">' + sec.items.map(function (x, i) {
        return '<button class="qbtn' + (x.done ? (x.skipped ? ' skip' : ' ok') : '') + (i === sec.cur ? ' cur' : '') + '" data-goto="' + i + '" aria-label="Question ' + (i + 1) + '">' + (i + 1) + '</button>';
      }).join('') + '</div>';
    } else {
      var n = roundItems(sec).filter(function (x) { return x.done; }).length;
      html += '<span class="chip">Mission ' + Math.min(sec.cur - sec.start + 1, ROUND) + ' / ' + ROUND + '</span><span class="chip">' + n + ' cleared</span>';
    }
    html += '</div></div>';

    if (state.tab !== 'lim' && roundDone(sec)) {
      html += '<div class="summary"><h3>Round complete!</h3><p>Score this round: <b>' +
        roundItems(sec).reduce(function (a, x) { return a + points(x); }, 0).toFixed(2) + ' / ' + ROUND + '</b></p>' +
        '<button class="btn" id="again">Play another round</button></div>';
      stage.innerHTML = html; $('again').onclick = newRound; return;
    }

    html += '<div class="qtype">' + (it.type ? it.type + ' • ' : '') + 'Q' + (state.tab === 'lim' ? it.id : sec.cur - sec.start + 1) + '</div>';
    html += '<div class="qbox" id="qbox">' + it.html + '</div>';
    if (state.tab === 'lim') html += '<p class="help">Type a number, a fraction like <code>3/4</code>, <code>INF</code>, <code>-INF</code>, or <code>DNE</code>. Reduce fractions.</p>';
    else if (state.tab === 'frac') html += '<p class="help">Answer as a <b>reduced improper fraction</b> like <code>7/4</code> or <code>-5/3</code> (whole numbers are just <code>2</code>).</p>';

    var prev = (it.attempts || []);
    html += '<form id="form" autocomplete="off">' + it.labels.map(function (l, i) {
      return '<label class="field"><span>' + esc(l) + '</span><input type="text" inputmode="text" name="p' + i + '" ' + (it.done ? 'disabled value="' + esc(it.answers[i]) + '"' : '') + ' autocapitalize="off" spellcheck="false"></label>';
    }).join('');
    if (!it.done) html += '<div class="row"><button class="btn" type="submit">Attack!</button><button class="btn ghost" type="button" id="skip">Give up (0 pts)</button></div>';
    html += '</form><div class="msg" id="msg" role="status" aria-live="polite"></div>';

    if (prev.length) html += '<div class="hist">Attempts: ' + prev.map(function (a) { return '<span class="' + (a.ok ? 'good' : 'bad') + '">' + esc(a.val.join(' | ')) + '</span>'; }).join(' ') + '</div>';

    if (it.done) {
      html += '<div class="row"><b class="pts">+' + points(it).toFixed(2) + ' pts</b>' +
        (pendingItem !== it ? '<button class="btn" id="next">Next \u25B6</button>' : '') + '</div>';
    }
    stage.innerHTML = html;

    var form = $('form');
    form.onsubmit = function (e) { e.preventDefault(); submit(); };
    if (!it.done) { form.querySelector('input').focus(); $('skip').onclick = giveUp; }
    var nx = $('next'); if (nx) nx.onclick = function () { advance(); };
    stage.querySelectorAll('[data-goto]').forEach(function (b) { b.onclick = function () { sec.cur = +b.getAttribute('data-goto'); save(); render(); }; });
  }

  function advance(k) {
    k = k || state.tab;
    var sec = state.sec[k];
    if (k === 'lim') {
      for (var i = 1; i <= sec.items.length; i++) { var j = (sec.cur + i) % sec.items.length; if (!sec.items[j].done) { sec.cur = j; break; } }
    } else if (sec.cur < sec.start + ROUND - 1) sec.cur++;
    else arenaItem = null;
    save(); if (state.tab === k) render();
  }

  function newRound() {
    var sec = state.sec[state.tab];
    sec.start = sec.items.length;
    for (var i = 0; i < ROUND; i++) sec.items.push(state.tab === 'mult' ? genMult() : genFrac());
    sec.cur = sec.start; save(); render();
  }

  /* ---------- play ---------- */
  function burst(text, cls) {
    var el = document.createElement('div');
    el.className = 'burst ' + cls; el.textContent = text;
    fx.appendChild(el); setTimeout(function () { el.remove(); }, 1100);
    var box = $('qbox'); if (box) { box.classList.remove('shake', 'pow'); void box.offsetWidth; box.classList.add(cls === 'bad' ? 'shake' : 'pow'); }
  }

  function submit() {
    var sec = state.sec[state.tab], it = sec.items[sec.cur];
    if (it.done) return;
    var inputs = Array.prototype.slice.call($('form').querySelectorAll('input'));
    var vals = inputs.map(function (i) { return i.value.trim(); });
    if (vals.some(function (v) { return v === ''; })) { $('msg').textContent = 'Fill in every box first.'; return; }
    var hints = [], allOk = true;
    it.labels.forEach(function (_, i) { var r = check(vals[i], it.answers[i]); if (!r.ok) { allOk = false; if (r.hint) hints.push(r.hint); } });
    it.attempts = it.attempts || [];
    it.attempts.push({ val: vals, ok: allOk, sec: it.time || 0, at: Date.now() });
    if (allOk) {
      it.done = true; state.streak++; state.best = Math.max(state.best, state.streak);
      var k = state.tab;
      pendingItem = it;
      setTimeout(function () { if (pendingItem === it) pendingItem = null; advance(k); }, 2000);
      save(); render(); burst('POW!', 'good');
      playAnim('aHero', 'atk', 900);
      setTimeout(function () { playAnim('slash', 'go', 350); $('aEnemy').classList.add('ko'); $('eHp').style.width = '0%'; }, 430);
      var n = it.attempts.length;
      $('msg').textContent = n === 1 ? 'First try! Full point.' : 'Got it on try ' + n + ' — worth 1/' + n + ' point.';
    } else {
      state.streak = 0; state.lives--;
      var refill = state.lives <= 0;
      if (refill) { state.lives = LIVES_MAX; state.refills++; }
      save(); render(); burst('OOF!', 'bad');
      playAnim('aEnemy', 'atk', 900);
      setTimeout(function () { playAnim('slash', 'go', 350); playAnim('aHero', 'hit', 600); }, 430);
      $('msg').textContent = hints.length ? hints.join(' ') : 'Not quite — try again!';
      if (refill) refillAnim();
    }
  }

  function giveUp() {
    var sec = state.sec[state.tab], it = sec.items[sec.cur];
    it.done = true; it.skipped = true; state.streak = 0;
    save(); render();
    $('msg').textContent = 'Answer: ' + it.answers.join(' | ') + '. No points — shake it off, hero!';
  }

  function refillAnim() {
    var el = document.createElement('div');
    el.className = 'refill';
    el.innerHTML = '<div class="refill-box">' + pixels(HERO, HERO_PAL, 8) + '<h2>POWER UP!</h2><p>HP restored to ' + LIVES_MAX + '</p></div>';
    fx.appendChild(el); document.body.classList.add('refilling');
    setTimeout(function () { el.remove(); document.body.classList.remove('refilling'); }, 2200);
  }

  /* ---------- report ---------- */
  function buildReport() {
    var h = '<h1>Math Hero Training — Report</h1>' +
      '<p><b>Student:</b> ' + esc(state.name || '________________') + ' &nbsp; <b>Report generated:</b> ' + stamp(Date.now(), true) + '</p>' +
      '<p><b>Total play time (duration):</b> ' + fmtDur(state.elapsed) + ' (' + fmtTime(state.elapsed) + ')</p>' +
      '<p><b>Total score:</b> ' + totalScore().toFixed(2) + ' &nbsp; <b>Best streak:</b> ' + state.best + ' &nbsp; <b>Lives refills:</b> ' + state.refills + '</p>' +
      '<p class="note">Scoring: solved on attempt n = 1/n point. Unsolved or given-up = 0.</p>';
    Object.keys(SECTIONS).forEach(function (k) {
      var items = state.sec[k].items.filter(function (it) { return it.attempts && it.attempts.length || it.done; });
      h += '<h2>' + SECTIONS[k] + ' — ' + secScore(k).toFixed(2) + ' pts (' + items.filter(function (x) { return x.done && !x.skipped; }).length + ' solved, ' + items.length + ' attempted)</h2>';
      if (!items.length) { h += '<p>No questions attempted.</p>'; return; }
      h += '<table><thead><tr><th>#</th><th>Question</th><th>Correct answer</th><th>Attempts (entered, time)</th><th>Result</th><th>Pts</th></tr></thead><tbody>';
      items.forEach(function (it, i) {
        var at = (it.attempts || []).map(function (a) { return (a.ok ? '✓ ' : '✗ ') + esc(a.val.join(' | ')) + ' (' + a.sec + 's into question' + (a.at ? ', ' + stamp(a.at, false) : '') + ')'; }).join('<br>');
        h += '<tr><td>' + (k === 'lim' ? it.id : i + 1) + '</td><td>' + esc(it.text) + (it.labels.length > 1 ? '<br><small>' + it.labels.map(esc).join(' | ') + '</small>' : '') + '</td><td>' + esc(it.answers.join(' | ')) +
          '</td><td>' + (at || '—') + '</td><td>' + (it.skipped ? 'Gave up' : it.done ? 'Solved (' + it.attempts.length + ')' : 'Incomplete') + '</td><td>' + points(it).toFixed(2) + '</td></tr>';
      });
      h += '</tbody></table>';
    });
    $('report').innerHTML = h;
  }

  /* ---------- init ---------- */
  state = load();
  var nameEl = $('name'); nameEl.value = state.name || '';
  function showName() { $('heroName').textContent = (state.name || '').trim() || 'HERO'; }
  showName();
  nameEl.oninput = function () { state.name = nameEl.value; showName(); save(); };
  document.querySelectorAll('.tab').forEach(function (b) { b.onclick = function () { state.tab = b.getAttribute('data-tab'); save(); render(); }; });
  $('export').onclick = function () { buildReport(); window.print(); };
  $('reset').onclick = function () { if (confirm('Start a brand new game? This erases the current report.')) { var nm = state.name; state = fresh(); state.name = nm; save(); render(); } };
  window.addEventListener('beforeprint', buildReport);
  $('aHero').innerHTML = pixels(HERO, HERO_PAL, 7);

  setInterval(function () {
    if (document.hidden) return;
    state.elapsed++;
    var it = state.sec[state.tab].items[state.sec[state.tab].cur];
    if (it && !it.done) it.time = (it.time || 0) + 1;
    $('timer').textContent = fmtTime(state.elapsed);
    if (state.elapsed % 5 === 0) save();
  }, 1000);

  /* background music: starts on first click/key (browsers block autoplay) */
  var bgm = $('bgm'), musicOn = true;
  try { musicOn = localStorage.getItem(KEY + '_music') !== 'off'; } catch (e) { /* ignore */ }
  bgm.volume = 0.35;
  function syncMusic() {
    $('music').textContent = 'Music: ' + (musicOn ? 'ON' : 'OFF');
    $('music').setAttribute('aria-pressed', musicOn ? 'true' : 'false');
    if (musicOn) { var p = bgm.play(); if (p && p.catch) p.catch(function () { /* waits for a gesture */ }); } else bgm.pause();
  }
  $('music').onclick = function () { musicOn = !musicOn; try { localStorage.setItem(KEY + '_music', musicOn ? 'on' : 'off'); } catch (e) { /* ignore */ } syncMusic(); };
  function firstGesture() { document.removeEventListener('pointerdown', firstGesture); document.removeEventListener('keydown', firstGesture); if (musicOn) syncMusic(); }
  document.addEventListener('pointerdown', firstGesture); document.addEventListener('keydown', firstGesture);
  $('music').textContent = 'Music: ' + (musicOn ? 'ON' : 'OFF');

  render();

  // expose for dev testing in the console / node
  window.MathHero = { check: check, parse: parse, genFrac: genFrac, genMult: genMult, LIMITS: LIMITS, gcd: gcd };
})();
