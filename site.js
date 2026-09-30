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
        'Less time for herself.',
        'Less room to choose.',
        'Less of her own voice.',
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
  const section = document.querySelector('.interviews');
  if (!section) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const items = [];
  function add(selector, direction) {
    section.querySelectorAll(selector).forEach((el) => {
      if (el.closest('.--new-static-motion')) return;
      el.classList.add('scroll-text');
      items.push({ el, direction, top: 0, y: 0 });
    });
  }
  add('.interviews-kicker', 'left');
  add('#interviews-title', 'left');
  add('.interviews-intro', 'right');
  const directions = ['left', 'bottom', 'right'];
  section.querySelectorAll('.interview-person').forEach((card, i) => {
    card.querySelectorAll('.interview-number,h2,.interview-pending').forEach((el) => {
      if (el.closest('.--new-static-motion')) return;
      el.classList.add('scroll-text');
      if (el.matches('.interview-number')) el.style.display = 'inline-block';
      items.push({ el, direction: directions[i % directions.length], top: 0, y: 0 });
    });
  });
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    if (el.closest('.--new-static-motion')) return;
    el.classList.add('scroll-text');
    items.push({ el, direction: el.dataset.reveal, top: 0, y: 0 });
  });
  let frame = 0,
    measureNeeded = true;
  const clamp = (value) => Math.max(0, Math.min(1, value));
  function update() {
    frame = 0;
    const height = innerHeight;
    const scroll = window.scrollY;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - height);
    if (measureNeeded) {
      items.forEach((item) => {
        item.top = item.el.getBoundingClientRect().top + scroll - item.y;
      });
      measureNeeded = false;
    }
    items.forEach((item) => {
      const start = item.top - height * 0.96;
      const end = Math.max(start + 1, Math.min(item.top - height * 0.55, maxScroll));
      const progress = motion.matches ? 1 : clamp((scroll - start) / (end - start));
      const remaining = (1 - progress) * (1 - progress);
      const y = item.direction === 'bottom' ? 100 * remaining : 0;
      item.y = y;
      item.el.style.setProperty('--reveal-x', '0px');
      item.el.style.setProperty('--reveal-y', `${y.toFixed(2)}px`);
      item.el.style.setProperty('--reveal-opacity', String(0.12 + 0.88 * progress));
    });
  }
  function schedule(measure = false) {
    measureNeeded = measureNeeded || measure;
    if (!frame) frame = requestAnimationFrame(update);
  }
  window.addEventListener('scroll', () => schedule(), { passive: true });
  window.addEventListener('resize', () => schedule(true));
  window.addEventListener('load', () => schedule(true));
  document.addEventListener('toggle', () => schedule(true), true);
  document.addEventListener('themechange', () => schedule(true));
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => schedule(true)).observe(section.closest('main') || document.body);
  }
  motion.addEventListener('change', () => {
    items.forEach((item) => {
      item.y = 0;
      item.el.style.setProperty('--reveal-y', '0px');
    });
    schedule(true);
  });
  if (document.fonts) document.fonts.ready.then(() => schedule(true));
  update();
})();

(() => {
  const rail = document.querySelector('.fish-silhouette-rail');
  if (!rail) return;
  const fish = rail.querySelector('span');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  function swim() {
    frame = 0;
    const travel = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const progress = Math.max(0, Math.min(1, scrollY / travel));
    const tilt = (7 * Math.PI) / 180;
    const width = fish.offsetWidth;
    const height = fish.offsetHeight;
    const insetX = (height * Math.cos(tilt) + width * Math.sin(tilt)) / 2 + 12;
    const insetY = (width * Math.cos(tilt) + height * Math.sin(tilt)) / 2 + 12;
    const interviewChapter = document.querySelector('#interviews');
    if (interviewChapter) {
      const chapterRect = interviewChapter.getBoundingClientRect();
      const spiralRect = interviewChapter.querySelector('.spiral-collage').getBoundingClientRect();
      rail.dataset.newOutside = String(spiralRect.bottom <= 0 || chapterRect.top >= innerHeight);
    }
    rail.style.setProperty('--fish-left', `${insetX}px`);
    rail.style.setProperty(
      '--fish-top',
      `${insetY + progress * Math.max(0, innerHeight - insetY * 2)}px`,
    );
    rail.style.setProperty(
      '--fish-sway',
      `${motion.matches ? 0 : Math.sin(scrollY / 110) * (innerWidth < 650 ? 1 : 3)}px`,
    );
    rail.style.setProperty(
      '--fish-angle',
      `${90 + (motion.matches ? 0 : Math.sin(scrollY / 140) * 7)}deg`,
    );
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(swim);
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('load', schedule);
  motion.addEventListener('change', schedule);
  swim();
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
