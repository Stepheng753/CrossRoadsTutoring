/* Five sets of 20 limit problems. Each set: 7 plug-in/factor, 4 vertical asymptote,
   4 piecewise, 5 horizontal asymptote (2 of them double-HA). Exposed as window.LIMIT_SETS. */
(function () {
  'use strict';
  function F(n, d) { return '<span class="frac"><span>' + n + '</span><span>' + d + '</span></span>'; }
  function S(x) { return '<span class="rad">√<span class="rt">' + x + '</span></span>'; }
  function lim(sub, body) { return '<div class="lim"><span class="limword">lim<sub>' + sub + '</sub></span><span class="expr">' + body + '</span></div>'; }
  function cases(rows) { return '<div class="cases">' + rows.map(function (r) { return '<div>' + r[0] + '<span class="cond">' + r[1] + '</span></div>'; }).join('') + '</div>'; }
  var LEFT = function (c) { return 'from the left (x→' + c + '⁻)'; };
  var RIGHT = function (c) { return 'from the right (x→' + c + '⁺)'; };
  var BOTH = ['x→+∞', 'x→−∞'];

  // single answer: sub = "x→3", body = html, text = plain text
  function one(type, sub, body, text, ans) { return { type: type, html: lim(sub, body), text: text, labels: ['Limit'], answers: [ans] }; }
  // left / right / overall
  function lr(type, c, html, text, l, r, o) { return { type: type, html: html, text: text, labels: [LEFT(c), RIGHT(c), 'overall limit'], answers: [l, r, o] }; }
  function va(c, body, text, l, r, o) { return lr('Vertical asymptote', c, lim('x→' + c, body), text, l, r, o); }
  function pw(c, rows, text, l, r, o) { return lr('Piecewise', c, 'f(x) = ' + cases(rows) + lim('x→' + c, 'f(x)'), text, l, r, o); }
  function absq(c, body, text, l, r, o) { return lr('Piecewise', c, lim('x→' + c, body), text, l, r, o); }
  function ha1(body, text, ans) { return one('Horizontal asymptote', 'x→+∞', body, text, ans); }
  function ha2(type, body, text, p, m) { return { type: type, html: lim('x→±∞', body), text: text, labels: BOTH, answers: [p, m] }; }
  var X2 = 'x<sup>2</sup>';

  window.LIMIT_SETS = [
    /* ---------- SET 1 ---------- */
    [
      one('Plug it in', 'x→3', X2 + ' − 2x + 1', 'lim x->3 (x^2 - 2x + 1)', '4'),
      one('Factor & cancel', 'x→2', F(X2 + ' − 4', 'x − 2'), 'lim x->2 (x^2 - 4)/(x - 2)', '4'),
      one('Factor & cancel', 'x→−1', F(X2 + ' + 3x + 2', 'x + 1'), 'lim x->-1 (x^2 + 3x + 2)/(x + 1)', '1'),
      one('Factor & cancel', 'x→0', F('3' + X2 + ' + 5x', 'x'), 'lim x->0 (3x^2 + 5x)/x', '5'),
      one('Factor & cancel', 'x→4', F('x − 4', X2 + ' − 16'), 'lim x->4 (x - 4)/(x^2 - 16)', '1/8'),
      one('Plug it in', 'x→1', F('x + 3', '2x + 4'), 'lim x->1 (x + 3)/(2x + 4)', '2/3'),
      one('Plug it in', 'x→5', S('x + 4'), 'lim x->5 sqrt(x + 4)', '3'),
      va(2, F('1', 'x − 2'), 'lim x->2 1/(x - 2)', '-INF', 'INF', 'DNE'),
      one('Vertical asymptote', 'x→3', F('1', '(x − 3)<sup>2</sup>'), 'lim x->3 1/(x - 3)^2', 'INF'),
      one('Vertical asymptote', 'x→−1', F('x', '(x + 1)<sup>2</sup>'), 'lim x->-1 x/(x + 1)^2', '-INF'),
      va(1, F('x + 2', 'x − 1'), 'lim x->1 (x + 2)/(x - 1)', '-INF', 'INF', 'DNE'),
      pw(2, [['x + 1', 'if x &lt; 2'], [X2 + ' − 1', 'if x ≥ 2']], 'f(x) = x+1 if x<2; x^2-1 if x>=2. lim x->2 f(x)', '3', '3', '3'),
      pw(1, [['2x', 'if x &lt; 1'], ['5 − x', 'if x ≥ 1']], 'f(x) = 2x if x<1; 5-x if x>=1. lim x->1 f(x)', '2', '4', 'DNE'),
      pw('−1', [[X2, 'if x ≤ −1'], ['3x + 4', 'if x &gt; −1']], 'f(x) = x^2 if x<=-1; 3x+4 if x>-1. lim x->-1 f(x)', '1', '1', '1'),
      absq(0, F('|x|', 'x'), 'lim x->0 |x|/x', '-1', '1', 'DNE'),
      ha1(F('3' + X2 + ' + 1', X2 + ' − 5'), 'lim x->inf (3x^2 + 1)/(x^2 - 5)', '3'),
      ha1(F('2x + 1', X2 + ' + 3'), 'lim x->inf (2x + 1)/(x^2 + 3)', '0'),
      ha2('Horizontal asymptote', F('x<sup>3</sup> + 1', X2 + ' + 1'), 'lim x->+-inf (x^3 + 1)/(x^2 + 1)', 'INF', '-INF'),
      ha2('Double HA', F(S('4' + X2 + ' + 1'), 'x + 3'), 'lim x->+-inf sqrt(4x^2 + 1)/(x + 3)', '2', '-2'),
      ha2('Double HA', F('3x', S(X2 + ' + 4')), 'lim x->+-inf 3x/sqrt(x^2 + 4)', '3', '-3')
    ],
    /* ---------- SET 2 ---------- */
    [
      one('Plug it in', 'x→−2', X2 + ' + 3x − 1', 'lim x->-2 (x^2 + 3x - 1)', '-3'),
      one('Factor & cancel', 'x→3', F(X2 + ' − 9', 'x − 3'), 'lim x->3 (x^2 - 9)/(x - 3)', '6'),
      one('Factor & cancel', 'x→1', F(X2 + ' − 1', X2 + ' − 3x + 2'), 'lim x->1 (x^2 - 1)/(x^2 - 3x + 2)', '-2'),
      one('Factor & cancel', 'x→0', F('5' + X2 + ' − 2x', 'x'), 'lim x->0 (5x^2 - 2x)/x', '-2'),
      one('Factor & cancel', 'x→−3', F('x + 3', X2 + ' − 9'), 'lim x->-3 (x + 3)/(x^2 - 9)', '-1/6'),
      one('Plug it in', 'x→2', F('x + 4', '3x − 2'), 'lim x->2 (x + 4)/(3x - 2)', '3/2'),
      one('Plug it in', 'x→8', S('x + 1'), 'lim x->8 sqrt(x + 1)', '3'),
      va('−1', F('2', 'x + 1'), 'lim x->-1 2/(x + 1)', '-INF', 'INF', 'DNE'),
      one('Vertical asymptote', 'x→0', F('−1', X2), 'lim x->0 -1/x^2', '-INF'),
      one('Vertical asymptote', 'x→2', F('x − 5', '(x − 2)<sup>2</sup>'), 'lim x->2 (x - 5)/(x - 2)^2', '-INF'),
      va('−2', F('x − 1', 'x + 2'), 'lim x->-2 (x - 1)/(x + 2)', 'INF', '-INF', 'DNE'),
      pw(1, [['3x − 1', 'if x &lt; 1'], [X2 + ' + 1', 'if x ≥ 1']], 'f(x) = 3x-1 if x<1; x^2+1 if x>=1. lim x->1 f(x)', '2', '2', '2'),
      pw('−2', [['x + 4', 'if x &lt; −2'], [X2, 'if x ≥ −2']], 'f(x) = x+4 if x<-2; x^2 if x>=-2. lim x->-2 f(x)', '2', '4', 'DNE'),
      pw(3, [[X2 + ' − 4', 'if x ≤ 3'], ['2x − 1', 'if x &gt; 3']], 'f(x) = x^2-4 if x<=3; 2x-1 if x>3. lim x->3 f(x)', '5', '5', '5'),
      absq(2, F('|x − 2|', 'x − 2'), 'lim x->2 |x - 2|/(x - 2)', '-1', '1', 'DNE'),
      ha1(F('5x<sup>3</sup> + 2', '2x<sup>3</sup> − x'), 'lim x->inf (5x^3 + 2)/(2x^3 - x)', '5/2'),
      ha1(F(X2 + ' + 3', 'x<sup>3</sup> − 2x'), 'lim x->inf (x^2 + 3)/(x^3 - 2x)', '0'),
      ha2('Horizontal asymptote', F(X2 + ' + 4', '2x + 1'), 'lim x->+-inf (x^2 + 4)/(2x + 1)', 'INF', '-INF'),
      ha2('Double HA', F(S('9' + X2 + ' + 2'), 'x − 1'), 'lim x->+-inf sqrt(9x^2 + 2)/(x - 1)', '3', '-3'),
      ha2('Double HA', F('6x', S('4' + X2 + ' + 3')), 'lim x->+-inf 6x/sqrt(4x^2 + 3)', '3', '-3')
    ],
    /* ---------- SET 3 ---------- */
    [
      one('Plug it in', 'x→−1', '2' + X2 + ' − x + 3', 'lim x->-1 (2x^2 - x + 3)', '6'),
      one('Factor & cancel', 'x→5', F(X2 + ' − 25', 'x − 5'), 'lim x->5 (x^2 - 25)/(x - 5)', '10'),
      one('Factor & cancel', 'x→−2', F(X2 + ' + x − 2', 'x + 2'), 'lim x->-2 (x^2 + x - 2)/(x + 2)', '-3'),
      one('Factor & cancel', 'x→0', F('4x<sup>3</sup> − x', 'x'), 'lim x->0 (4x^3 - x)/x', '-1'),
      one('Factor & cancel', 'x→6', F('x − 6', X2 + ' − 36'), 'lim x->6 (x - 6)/(x^2 - 36)', '1/12'),
      one('Plug it in', 'x→−1', F('x + 6', '3x + 7'), 'lim x->-1 (x + 6)/(3x + 7)', '5/4'),
      one('Plug it in', 'x→6', S('x + 10'), 'lim x->6 sqrt(x + 10)', '4'),
      va(1, F('4', 'x − 1'), 'lim x->1 4/(x - 1)', '-INF', 'INF', 'DNE'),
      one('Vertical asymptote', 'x→−2', F('3', '(x + 2)<sup>2</sup>'), 'lim x->-2 3/(x + 2)^2', 'INF'),
      one('Vertical asymptote', 'x→4', F('−x', '(x − 4)<sup>2</sup>'), 'lim x->4 -x/(x - 4)^2', '-INF'),
      va(3, F('2 − x', 'x − 3'), 'lim x->3 (2 - x)/(x - 3)', 'INF', '-INF', 'DNE'),
      pw('−1', [['2x + 3', 'if x &lt; −1'], ['−' + X2 + ' + 2', 'if x ≥ −1']], 'f(x) = 2x+3 if x<-1; -x^2+2 if x>=-1. lim x->-1 f(x)', '1', '1', '1'),
      pw(3, [[X2, 'if x &lt; 3'], ['10 − x', 'if x ≥ 3']], 'f(x) = x^2 if x<3; 10-x if x>=3. lim x->3 f(x)', '9', '7', 'DNE'),
      pw(4, [['3 − x', 'if x ≤ 4'], ['x − 5', 'if x &gt; 4']], 'f(x) = 3-x if x<=4; x-5 if x>4. lim x->4 f(x)', '-1', '-1', '-1'),
      absq(0, F('x', '|x|'), 'lim x->0 x/|x|', '-1', '1', 'DNE'),
      ha1(F('7' + X2 + ' − x', '3' + X2 + ' + 4'), 'lim x->inf (7x^2 - x)/(3x^2 + 4)', '7/3'),
      ha1(F('3x − 5', 'x<sup>3</sup> + 2'), 'lim x->inf (3x - 5)/(x^3 + 2)', '0'),
      ha2('Horizontal asymptote', F('−x<sup>3</sup> + 1', X2 + ' + 4'), 'lim x->+-inf (-x^3 + 1)/(x^2 + 4)', '-INF', 'INF'),
      ha2('Double HA', F(S(X2 + ' + 5x'), '2x + 1'), 'lim x->+-inf sqrt(x^2 + 5x)/(2x + 1)', '1/2', '-1/2'),
      ha2('Double HA', F('−x', S('4' + X2 + ' + 1')), 'lim x->+-inf -x/sqrt(4x^2 + 1)', '-1/2', '1/2')
    ],
    /* ---------- SET 4 ---------- */
    [
      one('Plug it in', 'x→2', 'x<sup>3</sup> − 3x + 1', 'lim x->2 (x^3 - 3x + 1)', '3'),
      one('Factor & cancel', 'x→−4', F(X2 + ' − 16', 'x + 4'), 'lim x->-4 (x^2 - 16)/(x + 4)', '-8'),
      one('Factor & cancel', 'x→3', F(X2 + ' − 2x − 3', 'x − 3'), 'lim x->3 (x^2 - 2x - 3)/(x - 3)', '4'),
      one('Factor & cancel', 'x→0', F('6' + X2 + ' + x', 'x'), 'lim x->0 (6x^2 + x)/x', '1'),
      one('Factor & cancel', 'x→−5', F('x + 5', X2 + ' − 25'), 'lim x->-5 (x + 5)/(x^2 - 25)', '-1/10'),
      one('Plug it in', 'x→3', F('2x − 1', 'x + 7'), 'lim x->3 (2x - 1)/(x + 7)', '1/2'),
      one('Plug it in', 'x→−12', S('4 − x'), 'lim x->-12 sqrt(4 - x)', '4'),
      va(4, F('3', 'x − 4'), 'lim x->4 3/(x - 4)', '-INF', 'INF', 'DNE'),
      one('Vertical asymptote', 'x→1', F('2', '(x − 1)<sup>2</sup>'), 'lim x->1 2/(x - 1)^2', 'INF'),
      one('Vertical asymptote', 'x→−3', F('x + 1', '(x + 3)<sup>2</sup>'), 'lim x->-3 (x + 1)/(x + 3)^2', '-INF'),
      va(0, F('x − 1', 'x'), 'lim x->0 (x - 1)/x', 'INF', '-INF', 'DNE'),
      pw('−1', [[X2 + ' + 2', 'if x &lt; −1'], ['4 − x', 'if x ≥ −1']], 'f(x) = x^2+2 if x<-1; 4-x if x>=-1. lim x->-1 f(x)', '3', '5', 'DNE'),
      pw(1, [['5x − 2', 'if x ≤ 1'], ['x + 2', 'if x &gt; 1']], 'f(x) = 5x-2 if x<=1; x+2 if x>1. lim x->1 f(x)', '3', '3', '3'),
      pw(4, [[S('x'), 'if x &lt; 4'], ['6 − x', 'if x ≥ 4']], 'f(x) = sqrt(x) if x<4; 6-x if x>=4. lim x->4 f(x)', '2', '2', '2'),
      absq('−1', F('|x + 1|', 'x + 1'), 'lim x->-1 |x + 1|/(x + 1)', '-1', '1', 'DNE'),
      ha1(F('2' + X2 + ' + x', '5' + X2 + ' − 3'), 'lim x->inf (2x^2 + x)/(5x^2 - 3)', '2/5'),
      ha1(F(X2 + ' + 1', 'x<sup>4</sup> + x'), 'lim x->inf (x^2 + 1)/(x^4 + x)', '0'),
      ha2('Horizontal asymptote', F('2x<sup>3</sup> − x', X2 + ' + 1'), 'lim x->+-inf (2x^3 - x)/(x^2 + 1)', 'INF', '-INF'),
      ha2('Double HA', F(S('16' + X2 + ' + x'), '2x − 3'), 'lim x->+-inf sqrt(16x^2 + x)/(2x - 3)', '2', '-2'),
      ha2('Double HA', F('10x', S('25' + X2 + ' + 1')), 'lim x->+-inf 10x/sqrt(25x^2 + 1)', '2', '-2')
    ],
    /* ---------- SET 5 ---------- */
    [
      one('Plug it in', 'x→−3', X2 + ' + 2x − 5', 'lim x->-3 (x^2 + 2x - 5)', '-2'),
      one('Factor & cancel', 'x→4', F(X2 + ' − 16', 'x − 4'), 'lim x->4 (x^2 - 16)/(x - 4)', '8'),
      one('Factor & cancel', 'x→−1', F(X2 + ' − x − 2', 'x + 1'), 'lim x->-1 (x^2 - x - 2)/(x + 1)', '-3'),
      one('Factor & cancel', 'x→0', F('2' + X2 + ' − 9x', 'x'), 'lim x->0 (2x^2 - 9x)/x', '-9'),
      one('Factor & cancel', 'x→7', F('x − 7', X2 + ' − 49'), 'lim x->7 (x - 7)/(x^2 - 49)', '1/14'),
      one('Plug it in', 'x→−2', F('x + 9', '2x + 10'), 'lim x->-2 (x + 9)/(2x + 10)', '7/6'),
      one('Plug it in', 'x→5', S('3x + 1'), 'lim x->5 sqrt(3x + 1)', '4'),
      va(2, F('5', 'x − 2'), 'lim x->2 5/(x - 2)', '-INF', 'INF', 'DNE'),
      one('Vertical asymptote', 'x→−3', F('−2', '(x + 3)<sup>2</sup>'), 'lim x->-3 -2/(x + 3)^2', '-INF'),
      one('Vertical asymptote', 'x→2', F('x', '(x − 2)<sup>2</sup>'), 'lim x->2 x/(x - 2)^2', 'INF'),
      va('−1', F('x − 3', 'x + 1'), 'lim x->-1 (x - 3)/(x + 1)', 'INF', '-INF', 'DNE'),
      pw(2, [['4x − 5', 'if x &lt; 2'], [X2 + ' − 1', 'if x ≥ 2']], 'f(x) = 4x-5 if x<2; x^2-1 if x>=2. lim x->2 f(x)', '3', '3', '3'),
      pw(2, [[X2 + ' − x', 'if x &lt; 2'], ['2x', 'if x ≥ 2']], 'f(x) = x^2-x if x<2; 2x if x>=2. lim x->2 f(x)', '2', '4', 'DNE'),
      pw('−1', [['2x + 1', 'if x ≤ −1'], [X2 + ' − 2', 'if x &gt; −1']], 'f(x) = 2x+1 if x<=-1; x^2-2 if x>-1. lim x->-1 f(x)', '-1', '-1', '-1'),
      absq(3, F('x − 3', '|x − 3|'), 'lim x->3 (x - 3)/|x - 3|', '-1', '1', 'DNE'),
      ha1(F('9' + X2 + ' − 2x', '4' + X2 + ' + 7'), 'lim x->inf (9x^2 - 2x)/(4x^2 + 7)', '9/4'),
      ha1(F('5' + X2 + ' + 1', 'x<sup>3</sup> + x'), 'lim x->inf (5x^2 + 1)/(x^3 + x)', '0'),
      ha2('Horizontal asymptote', F('x<sup>4</sup> + x', X2 + ' + 3'), 'lim x->+-inf (x^4 + x)/(x^2 + 3)', 'INF', 'INF'),
      ha2('Double HA', F(S(X2 + ' + 6x'), '3x + 2'), 'lim x->+-inf sqrt(x^2 + 6x)/(3x + 2)', '1/3', '-1/3'),
      ha2('Double HA', F('−4x', S('16' + X2 + ' + 5')), 'lim x->+-inf -4x/sqrt(16x^2 + 5)', '-1', '1')
    ]
  ];
})();
