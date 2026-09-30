(() => {
  const button = document.querySelector('.theme-toggle');
  if (!button) return;
  function render() {
    const dark = document.documentElement.dataset.theme === 'dark';
    button.setAttribute('aria-pressed', String(dark));
    button.querySelector('.theme-state').textContent = dark ? 'On' : 'Off';
  }
  button.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('flight-theme', theme);
    } catch (_) {}
    render();
    document.dispatchEvent(new Event('themechange'));
  });
  render();
})();

document.querySelectorAll('[data-open-about]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const d = document.querySelector('#about-dialog');
    if (d) {
      e.preventDefault();
      d.showModal();
    }
  }),
);
document
  .querySelectorAll('[data-close-dialog]')
  .forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));
document.querySelectorAll('dialog').forEach((d) =>
  d.addEventListener('click', (e) => {
    if (e.target === d) {
      const r = d.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
        d.close();
    }
  }),
);
function tick() {
  const d = new Date();
  document.querySelectorAll('[data-clock]').forEach((e) => {
    e.textContent =
      e.dataset.clock === 'date'
        ? d.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : d.toLocaleString('en-US');
  });
}
tick();
setInterval(tick, 1000);

(() => {
  const stage = document.querySelector('.fish-stage');
  if (!stage) return;
  const pieces = [...stage.querySelectorAll('.fish-piece')];
  const knife = stage.querySelector('.fish-knife');
  const reset = document.querySelector('.fish-reset');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let cuts = 0,
    busy = false,
    timer;
  function render() {
    stage.dataset.cuts = cuts;
    stage.setAttribute(
      'aria-label',
      cuts === 3
        ? 'Explore questions in the four fish pieces.'
        : `Cut the fish. ${cuts + 1} of 4 pieces.`,
    );
    stage.setAttribute('aria-disabled', 'false');
    pieces.forEach((piece, i) => {
      const separated = i > 3 - cuts;
      piece.style.setProperty('--shift', `${Math.max(0, i - (3 - cuts)) * 4 - cuts * 2}%`);
      piece.style.setProperty('--drop', separated ? `${i % 2 ? 3 : -2}%` : '0%');
      piece.style.setProperty('--tilt', separated ? `${i % 2 ? 3 : -2}deg` : '0deg');
    });
    knife.style.left = `${80 - cuts * 20 - cuts * 2}%`;
    reset.hidden = cuts === 0;
    const cost = document.querySelector('.cut-cost');
    const question = document.querySelector('.cut-question');
    if (cost && question) {
      cost.textContent = [
        '',
        'She has less time for herself.',
        'There are fewer choices left.',
        'It gets harder to speak up.',
      ][cuts];
      cost.hidden = cuts === 0;
      question.hidden = cuts !== 3;
    }
  }
  stage.addEventListener('click', () => {
    if (busy || cuts === 3) return;
    busy = true;
    stage.classList.add('is-cutting');
    timer = setTimeout(
      () => {
        cuts += 1;
        render();
        stage.classList.remove('is-cutting');
        busy = false;
        stage.dispatchEvent(new CustomEvent('fishcut', { detail: { cuts } }));
      },
      reducedMotion.matches ? 0 : 420,
    );
  });
  reset.addEventListener('click', () => {
    clearTimeout(timer);
    cuts = 0;
    busy = false;
    stage.classList.remove('is-cutting');
    render();
    stage.dispatchEvent(new Event('fishreset'));
    stage.focus();
  });
  render();
})();

(() => {
  const buttons = [...document.querySelectorAll('.portrait-window')];
  const name = document.querySelector('#conversation-name');
  const sheet = document.querySelector('#conversation-sheet');
  const source = document.querySelector('#interview-data');
  const interviews = source ? JSON.parse(source.textContent) : {};
  if (!name || !sheet) return;
  buttons.forEach((button) =>
    button.addEventListener('click', () => {
      buttons.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
      name.textContent = button.dataset.personName;
      sheet.dataset.person = button.dataset.person;
      const interview = interviews[button.dataset.person];
      const note = sheet.querySelector('.sheet-heading p');
      note.textContent = button.dataset.person === 'mother' ? '' : interview?.note || '';
      note.hidden = !note.textContent;
      sheet.querySelectorAll('.personal-answer').forEach((answer, i) => {
        answer.textContent = interview?.answers?.[i] || '';
        answer.classList.toggle('has-answer', Boolean(answer.textContent.trim()));
      });
      window.dispatchEvent(new Event('resize'));
      if (sheet.closest('.spiral-desk') || matchMedia('(max-width:700px)').matches) {
        sheet.scrollIntoView({
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
          block: 'start',
        });
      }
    }),
  );
})();
