(() => {
  const collage = document.querySelector('.spiral-collage');
  if (!collage) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !('IntersectionObserver' in window)) return;
  const line = collage.querySelector('.portrait-spiral path');
  line.style.setProperty('--spiral-length', line.getTotalLength());
  collage.classList.add('spiral-motion-ready');
  let startedAt = 0;
  const photoJobs = [];
  let triggerFrame = 0;
  function resetEntrance() {
    startedAt = 0;
    collage.classList.remove('spiral-entered');
    photoJobs.forEach((job) => job.reset());
  }
  function checkPosition() {
    triggerFrame = 0;
    if (motion.matches) return;
    const rect = collage.getBoundingClientRect();
    if (rect.bottom < -8 || rect.top > innerHeight + 8) {
      if (startedAt) resetEntrance();
      return;
    }
    if (!startedAt && rect.top <= innerHeight * 0.27 && rect.bottom >= innerHeight * 0.35) {
      startedAt = performance.now();
      collage.classList.add('spiral-entered');
    }
    if (startedAt) photoJobs.forEach((job) => job.start());
  }
  function checkSoon() {
    if (!triggerFrame) triggerFrame = requestAnimationFrame(checkPosition);
  }
  addEventListener('scroll', checkSoon, { passive: true });
  addEventListener('resize', checkSoon);
  addEventListener('pageshow', checkSoon);
  document.fonts.ready.then(checkSoon);
  checkSoon();
  collage.querySelectorAll('.portrait-window img').forEach((photo, index) => {
    const button = photo.closest('.portrait-window');
    let frame = 0,
      timer = 0,
      finished = false,
      scheduled = false,
      generation = 0;
    const canvas = document.createElement('canvas');
    canvas.className = 'mosaic-overlay';
    canvas.setAttribute('aria-hidden', 'true');
    const context = canvas.getContext('2d');
    if (!context) return;
    function finish() {
      finished = true;
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      button.classList.remove('mosaic-pending', 'mosaic-playing');
      canvas.remove();
    }
    function reset() {
      generation += 1;
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      finished = false;
      scheduled = false;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      button.classList.remove('mosaic-playing');
      button.classList.add('mosaic-pending');
      button.insertBefore(canvas, photo);
    }
    photoJobs.push({ finish, reset, start: tryStart });
    reset();
    function tryStart() {
      if (!startedAt || scheduled || finished) return;
      const rect = button.getBoundingClientRect();
      const visible = Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0);
      if (visible < Math.min(rect.height * 0.12, 80)) return;
      scheduled = true;
      const cycle = generation;
      const delay = Math.max(0, 1450 - (performance.now() - startedAt)) + index * 130;
      timer = setTimeout(async () => {
        try {
          await photo.decode();
          if (cycle !== generation) return;
          if (finished || motion.matches) return finish();
          const width = photo.clientWidth,
            height = photo.clientHeight;
          if (!width || !height) return finish();
          const dpr = Math.min(devicePixelRatio || 1, 2);
          canvas.width = Math.round(width * dpr);
          canvas.height = Math.round(height * dpr);
          canvas.style.height = `${height}px`;
          context.scale(dpr, dpr);
          const source = document.createElement('canvas');
          source.width = canvas.width;
          source.height = canvas.height;
          const sourceContext = source.getContext('2d');
          if (!sourceContext) return finish();
          const scale = Math.max(width / photo.naturalWidth, height / photo.naturalHeight);
          const cropWidth = width / scale,
            cropHeight = height / scale;
          const [positionX, positionY] = getComputedStyle(photo)
            .objectPosition.split(' ')
            .map((value) => parseFloat(value) / 100);
          sourceContext.drawImage(
            photo,
            (photo.naturalWidth - cropWidth) * positionX,
            (photo.naturalHeight - cropHeight) * positionY,
            cropWidth,
            cropHeight,
            0,
            0,
            source.width,
            source.height,
          );
          const tileSize = innerWidth < 650 ? 8 : 11;
          const tiles = [];
          for (let y = 0; y < height; y += tileSize)
            for (let x = 0; x < width; x += tileSize) {
              const noise =
                Math.abs(Math.sin(x * 12.9898 + y * 78.233 + index * 31) * 43758.5453) % 1;
              tiles.push({
                x,
                y,
                w: Math.min(tileSize, width - x),
                h: Math.min(tileSize, height - y),
                delay: (noise * 0.72 + (y / height) * 0.28) * 1000,
              });
            }
          button.classList.add('mosaic-playing');
          const start = performance.now();
          function draw(now) {
            if (finished || cycle !== generation) return;
            const elapsed = now - start;
            context.clearRect(0, 0, width, height);
            for (const tile of tiles) {
              const progress = Math.max(0, Math.min(1, (elapsed - tile.delay) / 380));
              if (!progress) continue;
              context.globalAlpha = progress * progress * (3 - 2 * progress);
              context.drawImage(
                source,
                tile.x * dpr,
                tile.y * dpr,
                tile.w * dpr,
                tile.h * dpr,
                tile.x,
                tile.y,
                tile.w,
                tile.h,
              );
            }
            if (elapsed < 1400) frame = requestAnimationFrame(draw);
            else finish();
          }
          frame = requestAnimationFrame(draw);
        } catch (_) {
          if (cycle === generation) finish();
        }
      }, delay);
    }
  });
  motion.addEventListener('change', () => {
    if (motion.matches) {
      collage.classList.remove('spiral-motion-ready');
      photoJobs.forEach((job) => job.finish());
    } else {
      collage.classList.add('spiral-motion-ready');
      resetEntrance();
      checkSoon();
    }
  });
})();
