(() => {
  const drawer = document.querySelector('#questions-drawer');
  const reader = document.querySelector('#question-reader');
  if (!drawer || !reader) return;
  const field = drawer.querySelector('.question-universe');
  const scroller = drawer.querySelector('.questions-scroll');
  const nav = drawer.querySelector('.questions-nav');
  const flipper = reader.querySelector('.question-flipper');
  const flip = reader.querySelector('[data-flip-question]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const palettes = ['#f7efe2', '#e5e9f3', '#f2dfe0', '#e5eddd'];
  let stageIndex = 0,
    questionIndex = 0,
    sourceCard,
    opener,
    destroyCoverflow;
  function paperImage(question, language) {
    const image = document.createElement('img');
    image.className = 'handwritten-strip';
    image.src = question.images[language];
    image.alt = question[language];
    image.decoding = 'async';
    image.draggable = false;
    return image;
  }
  function showQuestion(index) {
    const stage = questionStages[stageIndex];
    const count = stage.questions.length;
    questionIndex = ((index % count) + count) % count;
    const question = stage.questions[questionIndex];
    reader.setAttribute('aria-label', question.en);
    reader.classList.toggle('has-handwritten-paper', Boolean(question.images));
    ['en', 'zh'].forEach((language) => {
      const content = reader.querySelector(`[data-question-${language}]`);
      if (question.images) content.replaceChildren(paperImage(question, language));
      else content.textContent = question[language];
    });
    reader.style.setProperty('--paper', palettes[stageIndex]);
    setLanguage('en');
  }
  function setLanguage(language) {
    flipper.dataset.language = language;
    flipper.setAttribute(
      'aria-label',
      language === 'en' ? 'Flip question to Chinese' : 'Flip question to English',
    );
    flipper.querySelector('[lang="en"]').setAttribute('aria-hidden', String(language !== 'en'));
    flipper
      .querySelector('[lang="zh-Hans"]')
      .setAttribute('aria-hidden', String(language !== 'zh'));
    flip.textContent = language === 'en' ? '翻面 · 中文 ↻' : 'Flip · English ↻';
  }
  function toggleLanguage() {
    setLanguage(flipper.dataset.language === 'en' ? 'zh' : 'en');
  }
  function openReader(index, card) {
    sourceCard = card;
    showQuestion(index);
    drawer.dataset.reading = 'true';
    reader.showModal();
  }
  function renderStage(index) {
    destroyCoverflow?.();
    destroyCoverflow = null;
    stageIndex = index;
    const stage = questionStages[index];
    field.classList.toggle(
      'handwritten-universe',
      stage.questions.some((question) => question.images),
    );
    nav
      .querySelectorAll('button')
      .forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    field.setAttribute('aria-label', `${stage.label}: ${stage.questions.length} questions`);
    field.replaceChildren();
    scroller.scrollTop = 0;
    if (stage.id === 'childhood') {
      destroyCoverflow = window.createPaperCoverflow(field, stage.questions, openReader);
      field.querySelector('.arc-card[aria-current="true"]')?.focus({ preventScroll: true });
      return;
    }
    stage.questions.forEach((question, i) => {
      const arrival = document.createElement('div');
      arrival.className = 'q-arrival';
      const float = document.createElement('div');
      float.className = 'q-float';
      float.style.cssText = `--angle:${((i * 7) % 13) - 6}deg;--duration:${13 + (i % 7)}s;--delay:-${i * 1.8}s;--dx:${i % 2 ? 10 : -10}px;--paper:${palettes[(index + (i % 3)) % 4]}`;
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'paper-note';
      card.setAttribute('aria-haspopup', 'dialog');
      card.setAttribute('aria-controls', 'question-reader');
      card.dataset.question = i;
      const number = document.createElement('small');
      number.textContent = stage.label;
      const text = document.createElement('span');
      text.className = 'question-preview';
      text.textContent = question.en;
      if (question.images) {
        card.classList.add('handwritten-note');
        const image = paperImage(question, 'en');
        image.loading = i < 4 ? 'eager' : 'lazy';
        card.append(image);
      } else card.append(number, text);
      card.addEventListener('click', () => openReader(i, card));
      float.append(card);
      arrival.append(float);
      field.append(arrival);
      if (!motion.matches)
        arrival.animate(
          [
            { opacity: 0, transform: 'translate(70px,100px) scale(.72)' },
            { opacity: 1, transform: 'none' },
          ],
          {
            duration: 650,
            delay: Math.min(i, 8) * 45,
            easing: 'cubic-bezier(.2,.7,.2,1)',
            fill: 'backwards',
          },
        );
    });
  }
  questionStages.forEach((stage, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = stage.label;
    button.setAttribute('aria-pressed', String(i === 0));
    button.addEventListener('click', () => renderStage(i));
    nav.append(button);
  });
  function openQuestions(index = stageIndex, source = document.activeElement) {
    opener = source;
    if (!drawer.open) drawer.showModal();
    renderStage(index);
  }
  document
    .querySelector('.fish-more')
    .addEventListener('click', (event) => openQuestions(stageIndex, event.currentTarget));
  const fish = document.querySelector('.fish-stage');
  fish.addEventListener('childhoodquestion', (event) => {
    stageIndex = questionStages.findIndex((stage) => stage.id === 'childhood');
    openReader(event.detail.index, event.detail.source);
  });
  fish.addEventListener('click', (event) => {
    if (fish.dataset.cuts !== '3') return;
    const rect = fish.getBoundingClientRect();
    const x = event.detail === 0 ? 0.9 : (event.clientX - rect.left) / rect.width;
    const index = x < 0.36 ? 3 : x < 0.6 ? 2 : x < 0.84 ? 1 : 0;
    openQuestions(index, fish);
  });
  drawer.querySelector('.questions-close').addEventListener('click', () => drawer.close());
  reader.querySelector('.question-reader-close').addEventListener('click', () => reader.close());
  reader
    .querySelector('[data-previous-question]')
    .addEventListener('click', () => showQuestion(questionIndex - 1));
  reader
    .querySelector('[data-next-question]')
    .addEventListener('click', () => showQuestion(questionIndex + 1));
  flipper.addEventListener('click', toggleLanguage);
  flip.addEventListener('click', toggleLanguage);
  reader.addEventListener('close', () => {
    drawer.dataset.reading = 'false';
    sourceCard?.focus({ preventScroll: true });
  });
  drawer.addEventListener('close', () => {
    if (reader.open) reader.close();
    destroyCoverflow?.();
    destroyCoverflow = null;
    field.replaceChildren();
    opener?.focus({ preventScroll: true });
  });
  document.addEventListener('visibilitychange', () => {
    drawer.dataset.hidden = String(document.hidden);
  });
})();
