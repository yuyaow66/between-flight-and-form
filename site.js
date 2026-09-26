document.querySelectorAll('[data-open-about]').forEach(a=>a.addEventListener('click',e=>{const d=document.querySelector('#about-dialog');if(d){e.preventDefault();d.showModal()}}));document.querySelectorAll('[data-close-dialog]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));function tick(){const d=new Date();document.querySelectorAll('[data-clock]').forEach(e=>{e.textContent=e.dataset.clock==='date'?d.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}):d.toLocaleString('en-US')})}tick();setInterval(tick,1000);

// The original artwork is divided by clipping, so its texture stays intact.
(() => {
 const stage = document.querySelector('.fish-stage');
 if (!stage) return;
 const pieces = [...stage.querySelectorAll('.fish-piece')];
 const knife = stage.querySelector('.fish-knife');
 const status = document.querySelector('.fish-status');
 const reset = document.querySelector('.fish-reset');
 const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
 let cuts = 0, busy = false, timer;
 function render() {
  stage.dataset.cuts = cuts;
  stage.setAttribute('aria-label', cuts === 3 ? 'Fish cut into four pieces.' : `Cut the fish. ${cuts + 1} of 4 pieces.`);
  stage.setAttribute('aria-disabled', cuts === 3 ? 'true' : 'false');
  pieces.forEach((piece, i) => {
   const separated = i > 3 - cuts;
   piece.style.setProperty('--shift', `${Math.max(0, i - (3 - cuts)) * 4 - cuts * 2}%`);
   piece.style.setProperty('--drop', separated ? `${i % 2 ? 3 : -2}%` : '0%');
   piece.style.setProperty('--tilt', separated ? `${i % 2 ? 3 : -2}deg` : '0deg');
  });
  knife.style.left = `${80 - cuts * 20 - cuts * 2}%`;
  status.textContent = cuts === 3 ? 'Four pieces.' : `Click to cut · ${cuts + 1} / 4 pieces`;
  reset.hidden = cuts === 0;
 }
 stage.addEventListener('click', () => {
  if (busy || cuts === 3) return;
  busy = true;
  stage.classList.add('is-cutting');
  timer = setTimeout(() => {
   cuts += 1;
   render();
   stage.classList.remove('is-cutting');
   busy = false;
  }, reducedMotion.matches ? 0 : 420);
 });
 reset.addEventListener('click', () => {
  clearTimeout(timer); cuts = 0; busy = false;
  stage.classList.remove('is-cutting'); render(); stage.focus();
 });
 render();
})();
