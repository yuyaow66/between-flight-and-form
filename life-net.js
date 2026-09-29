(() => {
  const section = document.querySelector('#a-life-unfolding');
  if (!section) return;
  const words = [
    {
      title: 'Being a good girl.',
      body: 'Be a good girl. Be quiet. Be obedient. Do not talk back. Get good grades. Make your parents proud. Be sensible. Help with the housework. Put others first. Do not make trouble. Smile. Say thank you.',
    },
    {
      title: 'Being looked at.',
      body: 'Look pretty. Stay thin. Keep your skin fair. Dress modestly. Sit properly. Do not be too loud. Do not date too young. Do not draw attention. Be attractive. But not too attractive. Watch what you wear. What will people think?',
    },
    {
      title: 'Being the right kind of woman.',
      body: 'Find a stable job. Do not be too ambitious. Be successful. But not intimidating. Find a husband. Get married on time. Do not be too picky. Your clock is ticking. When will you have children? Be independent. But not too independent.',
    },
    {
      title: 'Being everything to everyone.',
      body: 'Be a good wife. Be a good mother. Put family first. Have another child. Keep the house clean. Take care of your parents. Support your husband. Be patient. Hold it together. Do not complain. You should be able to do it all.',
    },
    {
      title: 'Being needed. Staying useful.',
      body: 'Act your age. Help raise the grandchildren. Do not be selfish. Do not be a burden. Keep the family together. Stop thinking about yourself. You should be grateful. Stay useful. Do not ask for too much. It is too late to start again.',
    },
  ];
  const host = document.createElement('div');
  host.className = 'life-net';
  const instructions = document.createElement('span');
  instructions.className = 'life-net-instructions';
  instructions.id = 'life-net-instructions';
  instructions.textContent =
    'Drag the fish or the letters to pull the net. Click to guide the fish. With the canvas focused, use the arrow keys to move the fish. Press Escape to release it.';
  host.append(instructions);
  section.querySelector('.life-layout').append(host);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const dark = () => document.documentElement.dataset.theme === 'dark';
  let sketch,
    starting = false,
    visible = false,
    failed = false;
  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      if (visible && dark()) start();
      sketch?.sync();
    },
    { rootMargin: '160px' },
  );
  observer.observe(section);
  document.addEventListener('themechange', () => {
    if (dark()) start();
    sketch?.sync();
  });
  document.addEventListener('visibilitychange', () => sketch?.sync());
  reduced.addEventListener('change', () => sketch?.sync());
  async function start() {
    if (starting || sketch || failed) return;
    starting = true;
    try {
      await window.loadThesisP5();
      const fishImage = new Image();
      fishImage.src = 'assets/fish.webp';
      await Promise.all([fishImage.decode(), document.fonts.ready]);
      new window.p5((p) => {
        let canvas,
          nodes = [],
          links = [],
          columns = 0,
          rows = 0,
          stepX = 0,
          stepY = 0;
        let fish = { x: 0, y: 0, vx: 0, vy: 0, angle: 0 },
          target = { x: 0, y: 0 };
        let pointer = null,
          held = [],
          engagedUntil = 0,
          clock = 0,
          active = false;
        let fishWidth = 200,
          inset = 22,
          geometryWidth = 0,
          geometryHeight = 0;
        const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
        function build() {
          const w = Math.max(280, Math.round(host.clientWidth));
          const h = Math.max(480, Math.round(host.clientHeight));
          if (w === geometryWidth && h === geometryHeight) return;
          geometryWidth = w;
          geometryHeight = h;
          p.resizeCanvas(w, h);
          inset = w < 600 ? 12 : 24;
          columns = Math.floor((w - inset * 2) / (w < 600 ? 12 : 15));
          rows = Math.floor((h - 48) / 16);
          stepX = (w - inset * 2) / (columns - 1);
          stepY = (h - 48) / (rows - 1);
          nodes = [];
          links = [];
          let cursor = 0;
          for (let r = 0; r < rows; r++) {
            const band = Math.ceil(rows / 5);
            const chapter = words[Math.min(4, Math.floor(r / band))];
            const prominent = r % band === 0;
            const text = prominent ? chapter.title + '  ' : chapter.body + '  ';
            if (prominent) cursor = 0;
            for (let c = 0; c < columns; c++) {
              const x = inset + c * stepX,
                y = 24 + r * stepY;
              nodes.push({
                x,
                y,
                px: x,
                py: y,
                ox: x,
                oy: y,
                pin: r === 0 || c === 0 || r === rows - 1 || c === columns - 1,
                letter: text[cursor++ % text.length],
                prominent,
              });
              const i = r * columns + c;
              if (c) links.push([i - 1, i, stepX]);
              if (r) links.push([i - columns, i, stepY]);
            }
          }
          fishWidth = clamp(w * 0.29, 140, 290);
          fish = { x: w * 0.53, y: h * 0.48, vx: 0, vy: 0, angle: -0.12 };
          target = { x: fish.x, y: fish.y };
          pointer = null;
          held = [];
        }
        function wake() {
          engagedUntil = performance.now() + 2200;
          sync();
        }
        function sync() {
          active = dark() && visible && !document.hidden;
          if (!active) {
            pointer = null;
            held = [];
            p.noLoop();
          } else {
            build();
            if (!reduced.matches || performance.now() < engagedUntil) p.loop();
            else {
              p.noLoop();
              p.redraw();
            }
          }
        }
        function position(event) {
          const rect = canvas.getBoundingClientRect();
          return {
            x: ((event.clientX - rect.left) * p.width) / rect.width,
            y: ((event.clientY - rect.top) * p.height) / rect.height,
          };
        }
        p.setup = () => {
          const renderer = p.createCanvas(1, 1);
          renderer.parent(host);
          canvas = renderer.elt;
          p.pixelDensity(Math.min(devicePixelRatio || 1, 2));
          p.frameRate(40);
          canvas.tabIndex = 0;
          canvas.setAttribute('role', 'img');
          canvas.setAttribute(
            'aria-label',
            'A fish caught in a net woven from expectations. Interactive artwork.',
          );
          canvas.setAttribute('aria-describedby', 'life-net-instructions');
          canvas.addEventListener('pointerdown', (event) => {
            if (event.button !== 0) return;
            const point = position(event);
            const onFish =
              Math.hypot(
                (point.x - fish.x) / (fishWidth * 0.57),
                (point.y - fish.y) / (fishWidth * 0.3),
              ) < 1;
            pointer = {
              ...point,
              startX: point.x,
              startY: point.y,
              id: event.pointerId,
              mode: onFish ? 'fish' : 'net',
            };
            held = onFish
              ? []
              : nodes
                  .filter((n) => !n.pin && Math.hypot(n.x - point.x, n.y - point.y) < 48)
                  .map((n) => ({
                    node: n,
                    x: n.x,
                    y: n.y,
                    weight: Math.max(0.15, 1 - Math.hypot(n.x - point.x, n.y - point.y) / 55),
                  }));
            if (onFish) target = { ...point };
            canvas.setPointerCapture(event.pointerId);
            canvas.focus({ preventScroll: true });
            wake();
          });
          canvas.addEventListener('pointermove', (event) => {
            if (!pointer || pointer.id !== event.pointerId) return;
            Object.assign(pointer, position(event));
            if (pointer.mode === 'fish') target = { x: pointer.x, y: pointer.y };
            wake();
          });
          const release = (event) => {
            if (!pointer || (event.pointerId !== undefined && event.pointerId !== pointer.id))
              return;
            if (
              pointer.mode === 'net' &&
              Math.hypot(pointer.x - pointer.startX, pointer.y - pointer.startY) < 8
            )
              target = { x: pointer.x, y: pointer.y };
            if (canvas.hasPointerCapture(pointer.id)) canvas.releasePointerCapture(pointer.id);
            pointer = null;
            held = [];
            wake();
          };
          canvas.addEventListener('pointerup', release);
          canvas.addEventListener('pointercancel', release);
          canvas.addEventListener('lostpointercapture', () => {
            pointer = null;
            held = [];
          });
          canvas.addEventListener('keydown', (event) => {
            const moves = {
              ArrowLeft: [-45, 0],
              ArrowRight: [45, 0],
              ArrowUp: [0, -45],
              ArrowDown: [0, 45],
            };
            if (event.key === 'Escape') {
              release(event);
              canvas.blur();
              return;
            }
            if (!moves[event.key]) return;
            event.preventDefault();
            target.x += moves[event.key][0];
            target.y += moves[event.key][1];
            wake();
          });
          new ResizeObserver(() => {
            if (dark()) {
              build();
              wake();
            }
          }).observe(host);
          section.classList.add('net-ready');
          build();
          sketch = { sync };
          sync();
        };
        function simulate(dt) {
          clock += dt / 40;
          if (!pointer && !reduced.matches && performance.now() > engagedUntil) {
            target.x = p.width * (0.5 + 0.23 * Math.sin(clock * 0.43));
            target.y = p.height * (0.5 + 0.25 * Math.sin(clock * 0.31 + 0.7));
          }
          const rx = fishWidth * 0.43,
            ry = fishWidth * 0.21;
          target.x = clamp(target.x, inset + rx + 12, p.width - inset - rx - 12);
          target.y = clamp(target.y, 40 + ry, p.height - 40 - ry);
          fish.vx = (fish.vx + (target.x - fish.x) * 0.012 * dt) * Math.pow(0.84, dt);
          fish.vy = (fish.vy + (target.y - fish.y) * 0.012 * dt) * Math.pow(0.84, dt);
          fish.x += fish.vx * dt;
          fish.y += fish.vy * dt;
          fish.angle += (clamp(fish.vy * 0.055, -0.32, 0.32) - fish.angle) * 0.05 * dt;
          for (const n of nodes) {
            if (n.pin) {
              n.x = n.px = n.ox;
              n.y = n.py = n.oy;
              continue;
            }
            const vx = (n.x - n.px) * 0.92,
              vy = (n.y - n.py) * 0.92;
            n.px = n.x;
            n.py = n.y;
            n.x += vx + (n.ox - n.x) * 0.002 * dt;
            n.y += vy + (n.oy - n.y) * 0.002 * dt + 0.018 * dt * dt;
            const distance = Math.hypot((n.x - fish.x) / rx, (n.y - fish.y) / ry);
            if (distance < 2.1) {
              const weight = (1 - distance / 2.1) * 1.15;
              n.x += fish.vx * weight * dt;
              n.y += fish.vy * weight * dt;
            }
          }
          for (let iteration = 0; iteration < 4; iteration++) {
            for (const [ai, bi, length] of links) {
              const a = nodes[ai],
                b = nodes[bi],
                dx = b.x - a.x,
                dy = b.y - a.y,
                d = Math.hypot(dx, dy) || 1;
              const force = ((d - length) / d) * 0.23;
              if (!a.pin) {
                a.x += dx * force;
                a.y += dy * force;
              }
              if (!b.pin) {
                b.x -= dx * force;
                b.y -= dy * force;
              }
            }
            for (const n of nodes) {
              if (n.pin) continue;
              const dx = (n.x - fish.x) / rx,
                dy = (n.y - fish.y) / ry,
                d = Math.hypot(dx, dy);
              if (d < 1) {
                const angle =
                  d > 0.001 ? Math.atan2(dy, dx) : Math.atan2(n.oy - fish.y, n.ox - fish.x);
                n.x += (fish.x + Math.cos(angle) * rx - n.x) * 0.5;
                n.y += (fish.y + Math.sin(angle) * ry - n.y) * 0.5;
              }
              n.x = clamp(n.x, inset, p.width - inset);
              n.y = clamp(n.y, 24, p.height - 24);
            }
            if (pointer?.mode === 'net')
              for (const hold of held) {
                const x = hold.x + (pointer.x - pointer.startX) * hold.weight,
                  y = hold.y + (pointer.y - pointer.startY) * hold.weight;
                hold.node.x += (clamp(x, inset, p.width - inset) - hold.node.x) * 0.28;
                hold.node.y += (clamp(y, 24, p.height - 24) - hold.node.y) * 0.28;
              }
          }
        }
        p.draw = () => {
          if (!nodes.length) return;
          simulate(clamp(p.deltaTime / 25, 0.35, 1.5));
          p.clear();
          const ctx = p.drawingContext;
          ctx.save();
          ctx.translate(fish.x, fish.y);
          ctx.rotate(fish.angle);
          const fh = (fishWidth * fishImage.height) / fishImage.width;
          ctx.drawImage(fishImage, -fishWidth / 2, -fh / 2, fishWidth, fh);
          ctx.restore();
          ctx.lineWidth = 0.55;
          ctx.strokeStyle = 'rgba(175,133,159,.38)';
          ctx.beginPath();
          for (const [ai, bi] of links) {
            const a = nodes[ai],
              b = nodes[bi];
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
          }
          ctx.stroke();
          ctx.strokeStyle = 'rgba(219,176,195,.52)';
          const nearestColumn = clamp(Math.round((fish.x - inset) / stepX), 3, columns - 4);
          const nearestRow = clamp(Math.round((fish.y - 24) / stepY), 4, rows - 5);
          for (let offset = -2; offset <= 2; offset += 2) {
            const top = nodes[(nearestRow - 4) * columns + nearestColumn + offset];
            const bottom = nodes[(nearestRow + 4) * columns + nearestColumn + offset];
            const bend = fish.x + offset * stepX - fish.vx * 4;
            ctx.beginPath();
            ctx.moveTo(top.x, top.y);
            ctx.bezierCurveTo(
              bend,
              fish.y - fishWidth * 0.1,
              bend,
              fish.y + fishWidth * 0.1,
              bottom.x,
              bottom.y,
            );
            ctx.stroke();
          }
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            if (n.letter === ' ') continue;
            const next = nodes[i % columns === columns - 1 ? i - 1 : i + 1];
            const angle =
              Math.atan2(next.y - n.y, next.x - n.x) + (i % columns === columns - 1 ? Math.PI : 0);
            const strain = Math.min(1, Math.hypot(n.x - n.ox, n.y - n.oy) / 85);
            ctx.save();
            ctx.translate(n.x, n.y);
            ctx.rotate(angle);
            ctx.font = `italic 100 ${n.prominent ? (p.width < 600 ? 14 : 17) : p.width < 600 ? 12 : 14}px "PP Lettra Mono", monospace`;
            ctx.fillStyle = n.prominent
              ? 'rgba(226,176,194,.94)'
              : `rgba(197,181,202,${0.76 + strain * 0.22})`;
            ctx.fillText(n.letter, 0, 0);
            ctx.restore();
          }
          host.dataset.netState = pointer ? 'dragging' : 'swimming';
          if (reduced.matches && !pointer && performance.now() > engagedUntil) p.noLoop();
        };
      });
    } catch (error) {
      failed = true;
      host.hidden = true;
      section.classList.remove('net-ready');
      console.warn('The text net could not start.', error);
    } finally {
      starting = false;
    }
  }
  if (dark()) start();
})();
