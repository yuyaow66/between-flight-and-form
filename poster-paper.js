(() => {
  'use strict';
  const body = document.body;
  const assets = window.showcasePaperAssets;
  if (!body.classList.contains('poster-showcase') || !assets?.items?.length || document.querySelector('.poster-paper-backdrop')) return;
  const backdrop = document.createElement('div');
  backdrop.className = 'poster-paper-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  backdrop.style.setProperty('--poster-paper-atlas', `url("${assets.image}")`);
  body.prepend(backdrop);
  body.classList.add('poster-paper-active');
  let resizeTimer;
  let lastWidth = 0;
  let lastHeight = 0;
  const render = () => {
    const width = document.documentElement.clientWidth;
    const height = window.innerHeight;
    if (!width || !height || (width === lastWidth && height === lastHeight)) return;
    lastWidth = width;
    lastHeight = height;
    let seed = 438;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const mobile = width < 720;
    const rows = mobile ? Math.max(10, Math.min(13, Math.ceil(height / 68))) : Math.max(8, Math.min(10, Math.ceil(height / 92)));
    const columns = mobile ? 2 : Math.max(3, Math.ceil(width / 320));
    const spacing = width / columns;
    const rowStep = height / rows;
    const fragments = document.createDocumentFragment();
    for (let row = -1; row <= rows; row++) {
      for (let column = -1; column <= columns; column++) {
        const item = assets.items[Math.floor(random() * assets.items.length)];
        const [u, v, uvWidth, uvHeight] = item.uv;
        const paperWidth = mobile ? width * (.56 + random() * .23) : spacing * (1.3 + random() * .3);
        const paperHeight = paperWidth * item.ratio;
        const atlasWidth = paperWidth / uvWidth;
        const atlasHeight = paperHeight / uvHeight;
        const x = column * spacing + (row % 2) * spacing * .48 + (random() - .5) * spacing * .16;
        const y = row * rowStep + (random() - .5) * rowStep * .26;
        const paper = document.createElement('span');
        paper.className = 'poster-paper-strip';
        paper.style.width = `${paperWidth.toFixed(2)}px`;
        paper.style.height = `${paperHeight.toFixed(2)}px`;
        paper.style.left = `${x.toFixed(2)}px`;
        paper.style.top = `${y.toFixed(2)}px`;
        paper.style.backgroundSize = `${atlasWidth.toFixed(2)}px ${atlasHeight.toFixed(2)}px`;
        paper.style.backgroundPosition = `${(-u * atlasWidth).toFixed(2)}px ${(-v * atlasHeight).toFixed(2)}px`;
        paper.style.transform = `rotate(${((random() - .5) * 18).toFixed(2)}deg)`;
        paper.style.opacity = (.16 + random() * .11).toFixed(3);
        fragments.append(paper);
      }
    }
    backdrop.replaceChildren(fragments);
    backdrop.dataset.paperCount = String(backdrop.childElementCount);
    backdrop.dataset.renderer = 'static-atlas';
  };
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(render, 160);
  }, {passive: true});
  render();
})();
