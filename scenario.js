window.SCENARIO = {
  prompt: 'Name the thing keeping you up…',
  decision: 'Should I take the job in Juneau?',
  factors: [
    { label: 'The pay',        weight: 0.60, score:  0.70, note: 'Double. Hard to look away from.' },
    { label: 'The winters',    weight: 0.70, score: -0.70, note: 'Dark by three. It gets into you.' },
    { label: 'The boat',       weight: 0.80, score: -0.60, note: 'She stays here. That is the whole note.' },
    { label: "Mom's health",   weight: 0.90, score: -0.60, note: 'Someone should be close. Probably me.' },
    { label: 'The work itself', weight: 0.85, score:  0.80, note: 'The reason I am still considering it.' }
  ],
  seedLog: [
    { kind: 'note', text: 'Entry opened on a quiet night.' }
  ]
};

window.SKIN_CONFIG = {
  domain: 'personallog.ai',
  tagline: 'Your life, decomposed.',
  forSaleUrl: '#',
  scenario: window.SCENARIO,
  renderExtra: function (root, api) {
    root.innerHTML =
      '<div class="sk-read">' +
        '<div class="le-label"><span class="sk-flame"></span>Tonight\u2019s read</div>' +
        '<p class="sk-read-text" data-testid="read-text"></p>' +
        '<p class="sk-read-carry" data-testid="read-carry"></p>' +
        '<div class="sk-read-private">Private by design — this page keeps your log to itself. ' +
          'Nothing you write here leaves this tab.</div>' +
      '</div>';

    var textEl = root.querySelector('[data-testid="read-text"]');
    var carryEl = root.querySelector('[data-testid="read-carry"]');

    function sgn(n) { return (n < 0 ? '−' : '+') + Math.abs(Math.round(n * 100) / 100).toFixed(2); }

    function render() {
      if (!api.verdict || !api.factors.length) {
        textEl.innerHTML = '<span class="sk-read-quiet">Decompose, and the page will read the field back to you.</span>';
        carryEl.textContent = '';
        return;
      }
      var band = api.verdict.band.label;
      textEl.textContent = {
        'GO': 'The light is green. Pack warm, call your mother, go.',
        'HOLD': 'Not a no — a not-yet. The field is still listening.',
        'NO-GO': 'The field says stay. The boat would agree.'
      }[band] || 'The field is still listening.';

      var heaviest = api.factors.slice().sort(function (a, b) {
        return Math.abs(b.weight * b.score) - Math.abs(a.weight * a.score);
      })[0];
      carryEl.innerHTML = 'Carrying the most weight tonight: <strong>' + heaviest.label + '</strong> ' +
        '(' + Math.round(heaviest.weight * 100) + '% × ' + sgn(heaviest.score) + ').';
    }

    render();
    api.el.addEventListener('input', render);
    api.el.addEventListener('click', function () { setTimeout(render, 0); });
  }
};
