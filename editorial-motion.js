(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const outsideInterviews = (selector) =>
    [...document.querySelectorAll(selector)].find((element) => !element.closest('#interviews'));
  const scene = outsideInterviews('.release-scene');
  const release = scene?.querySelector('.release-fish');
  const clamp = (value) => Math.max(0, Math.min(1, value));
  const smooth = (value) => {
    const t = clamp(value);
    return t * t * (3 - 2 * t);
  };
  let frame = 0;

  scene?.classList.add('editorial-release');

  function render() {
    frame = 0;
    const height = innerHeight;
    if (scene && release) {
      const centre =
        scene.getBoundingClientRect().top + release.offsetTop + release.offsetHeight / 2;
      const reunion = motion.matches ? 1 : smooth((height * 0.98 - centre) / (height * 0.28));
      const swim = motion.matches ? 0 : smooth((height * 0.7 - centre) / (height * 0.4));
      scene.style.setProperty(
        '--new-narrative-gap',
        `${((1 - reunion) * Math.min(24, release.offsetWidth * 0.045)).toFixed(2)}px`,
      );
      scene.style.setProperty(
        '--new-narrative-swim-x',
        `${(swim * Math.min(75, scene.clientWidth * 0.13)).toFixed(2)}px`,
      );
      scene.style.setProperty('--new-narrative-swim-y', `${(-swim * 8).toFixed(2)}px`);
      scene.style.setProperty('--new-narrative-swim-angle', `${(-swim * 4).toFixed(2)}deg`);
    }
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('load', schedule);
  addEventListener('pageshow', schedule);
  document.addEventListener('toggle', schedule, true);
  document.addEventListener('themechange', schedule);
  motion.addEventListener('change', schedule);
  document.fonts?.ready.then(schedule);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    if (scene) observer.observe(scene);
  }
  render();
})();

(() => {
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  document.querySelectorAll('.paper-label').forEach((label) => {
    if (label.closest('#interviews')) return;
    const image = label.querySelector('img');
    const name = image?.alt || label.textContent.trim() || 'Paper';
    let x = 0,
      y = 0,
      gesture = null,
      holdTimer = 0,
      suppressClick = false;
    label.classList.add('is-draggable-paper');
    label.tabIndex = 0;
    label.setAttribute('role', 'group');
    label.setAttribute('aria-roledescription', 'draggable paper label');
    label.setAttribute('aria-label', `${name}. Use arrow keys to move; Escape to put it back.`);
    if (image) image.draggable = false;

    function paint() {
      label.style.setProperty('--new-drag-x', `${x.toFixed(1)}px`);
      label.style.setProperty('--new-drag-y', `${y.toFixed(1)}px`);
    }
    function place(nextX, nextY) {
      const rect = label.getBoundingClientRect();
      const baseLeft = rect.left - x;
      const baseRight = rect.right - x;
      const reach = Math.min(innerWidth * 0.14, 120);
      x = clamp(
        nextX,
        Math.max(-reach, 12 - baseLeft),
        Math.min(reach, innerWidth - 12 - baseRight),
      );
      y = clamp(nextY, -80, 80);
      paint();
    }
    function begin(clientX, clientY, id, touch) {
      if (gesture) return;
      suppressClick = false;
      gesture = { clientX, clientY, startX: x, startY: y, id, touch, active: false, moved: false };
      if (touch)
        holdTimer = setTimeout(() => {
          if (gesture?.touch) {
            gesture.active = true;
            label.classList.add('is-dragging');
          }
        }, 280);
    }
    function move(clientX, clientY, event) {
      if (!gesture) return;
      const dx = clientX - gesture.clientX;
      const dy = clientY - gesture.clientY;
      if (!gesture.active) {
        if (Math.hypot(dx, dy) < 7) return;
        if (gesture.touch) return finish();
        gesture.active = true;
        label.classList.add('is-dragging');
        label.setPointerCapture(gesture.id);
      }
      if (event.cancelable) event.preventDefault();
      if (Math.hypot(dx, dy) > 3) gesture.moved = true;
      place(gesture.startX + dx, gesture.startY + dy);
    }
    function finish() {
      clearTimeout(holdTimer);
      if (!gesture) return;
      suppressClick = gesture.moved;
      const id = gesture.id;
      gesture = null;
      label.classList.remove('is-dragging');
      if (label.hasPointerCapture?.(id)) label.releasePointerCapture(id);
    }
    label.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch' || !event.isPrimary || event.button !== 0) return;
      if (event.target.closest('a,button,input,textarea,select')) return;
      begin(event.clientX, event.clientY, event.pointerId, false);
    });
    label.addEventListener('pointermove', (event) => {
      if (gesture && !gesture.touch && gesture.id === event.pointerId)
        move(event.clientX, event.clientY, event);
    });
    label.addEventListener('pointerup', (event) => {
      if (gesture && !gesture.touch && gesture.id === event.pointerId) finish();
    });
    label.addEventListener('pointercancel', (event) => {
      if (gesture && !gesture.touch && gesture.id === event.pointerId) finish();
    });
    label.addEventListener('lostpointercapture', () => {
      if (gesture && !gesture.touch) finish();
    });
    label.addEventListener('pointerleave', () => {
      if (gesture && !gesture.touch && !gesture.active) finish();
    });
    label.addEventListener(
      'touchstart',
      (event) => {
        if (event.touches.length !== 1) return finish();
        const touch = event.changedTouches[0];
        begin(touch.clientX, touch.clientY, touch.identifier, true);
      },
      { passive: true },
    );
    label.addEventListener(
      'touchmove',
      (event) => {
        if (!gesture?.touch) return;
        if (event.touches.length !== 1) return finish();
        const touch = [...event.touches].find((item) => item.identifier === gesture.id);
        if (touch) move(touch.clientX, touch.clientY, event);
      },
      { passive: false },
    );
    label.addEventListener('touchend', finish);
    label.addEventListener('touchcancel', finish);
    label.addEventListener(
      'click',
      (event) => {
        if (!suppressClick) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        suppressClick = false;
      },
      true,
    );
    label.addEventListener('keydown', (event) => {
      if (event.target !== label) return;
      const step = event.shiftKey ? 20 : 8;
      const arrows = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      };
      if (arrows[event.key]) {
        event.preventDefault();
        place(x + arrows[event.key][0], y + arrows[event.key][1]);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        finish();
        x = 0;
        y = 0;
        paint();
      }
    });
    addEventListener('resize', () => {
      finish();
      x = 0;
      y = 0;
      paint();
    });
  });
})();
