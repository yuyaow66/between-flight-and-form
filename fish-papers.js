(() => {
  const fish = document.querySelector('.fish-stage');
  const section = fish?.closest('.fish-interaction');
  const head = fish?.querySelector('.fish-head');
  const childhood = questionStages.find((stage) => stage.id === 'childhood');
  if (!section || !head || !childhood) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const anchor = document.createElement('span');
  anchor.className = 'fish-paper-origin';
  head.append(anchor);
  const layer = document.createElement('div');
  layer.className = 'fish-papers';
  layer.setAttribute('role', 'group');
  layer.setAttribute('aria-label', 'Questions from childhood');
  layer.hidden = true;
  section.append(layer);
  let cards = [],
    frame = 0,
    followUntil = 0,
    generation = 0;
  function position() {
    const point = anchor.getBoundingClientRect();
    const bounds = section.getBoundingClientRect();
    const width = Math.min(310, innerWidth * 0.62);
    const originY = point.top - bounds.top;
    const rise = Math.max(100, Math.min(330, originY - width * 0.22 - 16));
    layer.style.transform = `translate3d(${point.left - bounds.left}px, ${originY}px, 0)`;
    cards.forEach(({ button, spread, angle }, i) => {
      const progress = (i + 1) / cards.length;
      const scale = 0.24 + progress * 0.76;
      const halfWidth = width * scale * 0.56;
      const x = Math.max(
        12 + halfWidth - point.left,
        Math.min(innerWidth - 12 - halfWidth - point.left, spread * width * progress),
      );
      button.style.setProperty('--paper-width', `${width}px`);
      button.style.setProperty('--paper-x', `${x}px`);
      button.style.setProperty('--paper-y', `${-rise * Math.pow(progress, 1.25)}px`);
      button.style.setProperty('--paper-angle', `${angle}deg`);
      button.style.setProperty('--paper-scale', scale);
    });
  }
  function follow(now) {
    frame = 0;
    if (layer.hidden) return;
    position();
    if (now < followUntil) frame = requestAnimationFrame(follow);
  }
  function track() {
    followUntil = performance.now() + (motion.matches ? 0 : 750);
    if (!frame) frame = requestAnimationFrame(follow);
  }
  function clear() {
    generation += 1;
    cancelAnimationFrame(frame);
    frame = 0;
    cards.forEach(({ button }) =>
      button.getAnimations().forEach((animation) => animation.cancel()),
    );
    cards = [];
    layer.replaceChildren();
    layer.hidden = true;
  }
  async function release() {
    clear();
    const current = generation;
    const choices = childhood.questions
      .map((question, index) => ({ question, index }))
      .filter(({ question }) => question.images?.en);
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    cards = choices.slice(0, innerWidth < 600 ? 4 : 5).map(({ question, index }, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'fish-paper';
      button.dataset.question = index;
      button.setAttribute('aria-label', question.en);
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-controls', 'question-reader');
      button.style.visibility = 'hidden';
      const image = document.createElement('img');
      image.src = question.images.en;
      image.alt = question.en;
      image.draggable = false;
      image.decoding = 'async';
      button.append(image);
      button.addEventListener('click', () => {
        fish.dispatchEvent(
          new CustomEvent('childhoodquestion', { detail: { index, source: button } }),
        );
      });
      layer.append(button);
      return {
        button,
        image,
        spread: (i % 2 ? 1 : -1) * (0.08 + Math.random() * 0.18),
        angle: (i % 2 ? 1 : -1) * (6 + Math.random() * 10),
      };
    });
    layer.hidden = false;
    track();
    await Promise.allSettled(cards.map(({ image }) => image.decode()));
    if (current !== generation || fish.dataset.cuts === '0') return;
    position();
    cards.forEach(({ button, image }, i) => {
      if (!image.naturalWidth) {
        button.remove();
        return;
      }
      button.style.visibility = '';
      if (motion.matches) return;
      button.animate(
        [
          { opacity: 0, transform: 'translate(-50%, -50%) rotate(65deg) scale(0.04)' },
          { opacity: 1, offset: 0.16 },
          {
            opacity: 1,
            transform:
              'translate(calc(-50% + var(--paper-x)), calc(-50% + var(--paper-y))) rotate(var(--paper-angle)) scale(var(--paper-scale))',
          },
        ],
        {
          duration: 1500 + i * 100,
          delay: (cards.length - 1 - i) * 180,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'backwards',
        },
      );
    });
  }
  fish.addEventListener('fishcut', (event) => {
    if (event.detail.cuts === 1) release();
    else track();
  });
  fish.addEventListener('fishreset', clear);
  new ResizeObserver(() => {
    if (!layer.hidden) track();
  }).observe(fish);
  motion.addEventListener('change', () => {
    if (motion.matches) {
      cards.forEach(({ button }) =>
        button.getAnimations().forEach((animation) => animation.finish()),
      );
    }
  });
})();
