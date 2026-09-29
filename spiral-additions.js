(() => {
  const collage = document.querySelector('#interviews .spiral-collage');
  if (!collage) return;
  const underlay = document.querySelector('#interviews .new-family-underlay');
  const chapter = document.querySelector('#interviews');
  let pending = 0;
  function place() {
    pending = 0;
    const parallax = Math.max(-24, Math.min(24, -chapter.getBoundingClientRect().top * 0.035));
    underlay?.style.setProperty('--new-family-parallax', `${parallax.toFixed(2)}px`);
  }
  const schedule = () => {
    if (!pending) pending = requestAnimationFrame(place);
  };
  addEventListener('resize', schedule);
  addEventListener('scroll', schedule, { passive: true });
  collage.addEventListener('animationend', schedule);
  collage.addEventListener('transitionend', schedule);
  collage.addEventListener('pointerleave', schedule);
  document.fonts.ready.then(schedule);
  document.fonts.addEventListener('loadingdone', schedule);
  collage
    .querySelectorAll('.portrait-window img')
    .forEach((img) => img.addEventListener('load', schedule));
  collage
    .querySelectorAll('.portrait-window')
    .forEach((portrait) =>
      new MutationObserver(schedule).observe(portrait, {
        attributes: true,
        attributeFilter: ['class'],
      }),
    );
  schedule();
})();
