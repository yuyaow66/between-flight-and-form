(() => {
  const labels = document.querySelector('.expectation-words');
  if (!labels || !('IntersectionObserver' in window)) return;
  labels.classList.add('paper-labels-ready');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) labels.classList.add('is-visible');
        else if (entry.boundingClientRect.bottom < 0 || entry.boundingClientRect.top > innerHeight)
          labels.classList.remove('is-visible');
      });
    },
    { threshold: 0, rootMargin: '0px 0px -12% 0px' },
  );
  observer.observe(labels);
})();
