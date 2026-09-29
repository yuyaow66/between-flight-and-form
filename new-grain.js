(() => {
  'use strict';
  const root = document.documentElement;
  const main = document.querySelector('.collage-layout');
  const host = main || document.body;
  if (!main) document.body.classList.add('new-grain-information');
  const canvas = document.createElement('canvas');
  canvas.className = 'new-grain-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.prepend(canvas);
  let context;
  try {
    context = canvas.getContext('2d', { alpha: true });
  } catch (_) {}
  let layer = canvas;
  const surfaces = [
    ...document.querySelectorAll('.poster-art,#films,#questions-drawer,.paper-note'),
  ];
  for (const el of surfaces) el.classList.add('new-grain-surface');

  let thresholds,
    pixels,
    width = 0,
    height = 0,
    frame = 0;
  let lastCurve = '',
    lastInk = '',
    dirty = true;
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const rect = (el) => el.getBoundingClientRect();
  const parse = (value) => (value.match(/[\d.]+/g) || []).map(Number);
  const inkProbe = document.createElement('span');
  inkProbe.className = 'new-grain-color-probe';
  inkProbe.setAttribute('aria-hidden', 'true');
  inkProbe.style.cssText =
    'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;color:var(--swatch-1)';
  document.body.append(inkProbe);

  function resize() {
    const scale = Math.min(devicePixelRatio || 1, 1);
    width = Math.max(1, Math.floor(innerWidth * scale));
    height = Math.max(1, Math.floor(innerHeight * scale));
    canvas.width = width;
    canvas.height = height;
    thresholds = new Float32Array(width * height);
    let seed = 0x4f1bbcdc;
    for (let i = 0; i < thresholds.length; i++) {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      thresholds[i] = (seed >>> 0) / 4294967296;
    }
    if (context) pixels = context.createImageData(width, height);
    root.style.setProperty('--new-grain-width', `${innerWidth}px`);
    root.style.setProperty('--new-grain-height', `${innerHeight}px`);
    dirty = true;
    schedule();
  }

  function fallbackImage(density) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><filter id="new-grain-filter"><feTurbulence type="fractalNoise" baseFrequency=".95" numOctaves="1" seed="73"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0"/><feComponentTransfer><feFuncA type="linear" slope="64" intercept="${-64 * (1 - density)}"/></feComponentTransfer><feComponentTransfer><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer></filter><rect width="100%" height="100%" filter="url(#new-grain-filter)"/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }

  function draw() {
    frame = 0;
    const style = getComputedStyle(root);
    const min = clamp(parseFloat(style.getPropertyValue('--new-grain-min')) || 0.12);
    const max = clamp(parseFloat(style.getPropertyValue('--new-grain-max')) || 0.9);
    const direction = style.getPropertyValue('--new-grain-dir').trim();
    const curve = `${min}/${max}/${direction}`;
    const averageDensity = (min + max) / 2;
    const ink = getComputedStyle(inkProbe).color;
    const rgba = parse(ink);
    const dark = root.dataset.theme === 'dark';
    const energy = dark ? 0.069 : 0.061;
    const alpha = Math.min(1, energy / Math.max(0.001, averageDensity));
    layer.style.opacity = String(alpha);
    layer.style.setProperty('--new-grain-ink', ink);

    if (dirty || curve !== lastCurve || ink !== lastInk) {
      if (context) {
        const data = pixels.data;
        for (let y = 0; y < height; y++) {
          const t = y / Math.max(1, height - 1);
          const u = direction === 'up' ? 1 - t : t;
          const density = min + (max - min) * u * u * (3 - 2 * u);
          for (let x = 0; x < width; x++) {
            const i = y * width + x,
              j = i * 4;
            data[j] = rgba[0];
            data[j + 1] = rgba[1];
            data[j + 2] = rgba[2];
            data[j + 3] = thresholds[i] < density ? Math.round(255 * (rgba[3] ?? 1)) : 0;
          }
        }
        context.putImageData(pixels, 0, 0);
        root.style.setProperty('--new-grain-image', `url("${canvas.toDataURL()}")`);
      } else {
        root.style.setProperty('--new-grain-image', fallbackImage(averageDensity));
        root.style.setProperty(
          '--new-grain-mask-start',
          `color-mix(in srgb, ${ink} ${(direction === 'up' ? max : min) * 100}%, transparent)`,
        );
        root.style.setProperty(
          '--new-grain-mask-end',
          `color-mix(in srgb, ${ink} ${(direction === 'up' ? min : max) * 100}%, transparent)`,
        );
      }
      lastCurve = curve;
      lastInk = ink;
      dirty = false;
    }
    for (const el of surfaces) {
      const box = rect(el);
      const film = el.id === 'films';
      const paper = el.classList.contains('paper-note');
      el.style.setProperty(
        '--new-grain-ink',
        film ? 'var(--new-ef-paper)' : paper ? 'var(--swatch-1)' : ink,
      );
      el.style.setProperty(
        '--new-grain-alpha',
        String(
          Math.min(1, (film ? 0.0045 : paper ? 0.012 : energy) / Math.max(0.001, averageDensity)),
        ),
      );
      el.style.setProperty('--new-grain-x', `${-box.left}px`);
      el.style.setProperty('--new-grain-y', `${-box.top}px`);
    }
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(draw);
  }
  if (!context) {
    layer = document.createElement('div');
    layer.className = 'new-grain-fallback';
    root.classList.add('new-grain-fallback-active');
    layer.setAttribute('aria-hidden', 'true');
    canvas.replaceWith(layer);
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', resize, { passive: true });
  document.addEventListener('themechange', () => {
    dirty = true;
    schedule();
  });
  new MutationObserver(() => {
    dirty = true;
    schedule();
  }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  new ResizeObserver(() => {
    schedule();
  }).observe(host);
  document.fonts.ready.then(() => {
    schedule();
  });
  resize();
})();
