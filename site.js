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


// Continuous, reversible scroll progress, rather than a timed entrance animation.
(() => {
 const section = document.querySelector('.interviews');
 if (!section) return;
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 const items = [];
 function add(selector, direction) {
  section.querySelectorAll(selector).forEach(el => {
   el.classList.add('scroll-text');
   items.push({el, direction, top:0, y:0});
  });
 }
 add('.interviews-kicker', 'left');
 add('#interviews-title', 'left');
 add('.interviews-intro', 'right');
 const directions = ['left','bottom','right'];
 section.querySelectorAll('.interview-person').forEach((card,i) => {
  card.querySelectorAll('.interview-number,h2,.interview-pending').forEach(el => {
   el.classList.add('scroll-text');
   // Inline numbers need a transformable box.
   if (el.matches('.interview-number')) el.style.display = 'inline-block';
   items.push({el, direction:directions[i], top:0, y:0});
  });
 });
 document.querySelectorAll('[data-reveal]').forEach(el => {
  el.classList.add('scroll-text');
  items.push({el, direction:el.dataset.reveal, top:0, y:0});
 });
 let frame = 0, measureNeeded = true;
 const clamp = value => Math.max(0,Math.min(1,value));
 function update() {
  frame = 0;
  const height = innerHeight;
  const scroll = window.scrollY;
  const maxScroll = Math.max(0,document.documentElement.scrollHeight-height);
  if (measureNeeded) {
   // Subtract the existing transform to measure the unchanged layout position.
   items.forEach(item => { item.top = item.el.getBoundingClientRect().top + scroll - item.y; });
   measureNeeded = false;
  }
  items.forEach(item => {
   const start = item.top - height * .96;
   const end = Math.max(start+1,Math.min(item.top-height*.55,maxScroll));
   const progress = motion.matches ? 1 : clamp((scroll-start)/(end-start));
   const remaining = (1-progress)*(1-progress);
   const distance = Math.min(180,innerWidth*.22);
   const x = item.direction==='left' ? -distance*remaining : item.direction==='right' ? distance*remaining : 0;
   const y = item.direction==='bottom' ? 100*remaining : 28*remaining;
   item.y = y;
   item.el.style.setProperty('--reveal-x',`${x.toFixed(2)}px`);
   item.el.style.setProperty('--reveal-y',`${y.toFixed(2)}px`);
   item.el.style.setProperty('--reveal-opacity',String(.12+.88*progress));
  });
 }
 function schedule(measure=false) {
  measureNeeded = measureNeeded || measure;
  if (!frame) frame = requestAnimationFrame(update);
 }
 window.addEventListener('scroll',()=>schedule(),{passive:true});
 window.addEventListener('resize',()=>schedule(true));
 window.addEventListener('load',()=>schedule(true));
 motion.addEventListener('change',()=>{
  // Reset before measurement because reduced-motion CSS overrides transforms.
  items.forEach(item=>{item.y=0;item.el.style.setProperty('--reveal-y','0px');});
  schedule(true);
 });
 if (document.fonts) document.fonts.ready.then(()=>schedule(true));
 update();
})();

// The fish follows page progress, with a small scroll-driven swimming motion.
(() => {
 const rail = document.querySelector('.fish-silhouette-rail');
 if (!rail) return;
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 let frame = 0;
 function swim() {
  frame = 0;
  const travel = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const progress = Math.max(0, Math.min(1, scrollY / travel));
  rail.style.setProperty('--fish-top', `${12 + progress * 76}%`);
  rail.style.setProperty('--fish-sway', `${motion.matches ? 0 : Math.sin(scrollY / 110) * (innerWidth < 650 ? 1 : 3)}px`);
  rail.style.setProperty('--fish-angle', `${90 + (motion.matches ? 0 : Math.sin(scrollY / 140) * 7)}deg`);
 }
 function schedule() { if (!frame) frame = requestAnimationFrame(swim); }
 addEventListener('scroll', schedule, {passive:true});
 addEventListener('resize', schedule);
 addEventListener('load', schedule);
 motion.addEventListener('change', schedule);
 swim();
})();
