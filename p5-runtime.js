(() => {
  let loading;
  window.loadThesisP5 = () => {
    if (window.p5) return Promise.resolve(window.p5);
    if (!loading)
      loading = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'assets/vendor/p5/p5.min.js';
        script.onload = () => resolve(window.p5);
        script.onerror = () => {
          script.remove();
          loading = undefined;
          reject(new Error('Unable to load p5.js'));
        };
        document.head.append(script);
      });
    return loading;
  };
})();
