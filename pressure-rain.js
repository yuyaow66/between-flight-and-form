(() => {
  const host = document.createElement('div');
  host.className = 'pressure-rain';
  host.setAttribute('aria-hidden', 'true');
  document.body.append(host);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const enabled = () =>
    document.documentElement.dataset.theme === 'dark' && !motion.matches && !document.hidden;
  let sketch,
    starting = false;
  async function sync() {
    if (sketch) {
      sketch.syncRain();
      return;
    }
    if (!enabled() || starting) return;
    starting = true;
    try {
      const P5 = await window.loadThesisP5();
      new P5((p) => {
        const vocabulary = ['爱', '不甘', '委屈', '渴望'];
        const palette = ['#fefefe', '#f40009'];
        const particles = [];
        const sprites = [];
        let time = 0,
          ready = false,
          trails,
          scale = 1,
          viewportWidth = 0,
          viewportHeight = 0;
        class Word {
          constructor() {
            this.reset(true);
          }
          reset(initial = false) {
            this.x = p.random(12, p.width - 12);
            this.y = initial ? p.random(-30, p.height) : p.random(-60, -20);
            this.sprite = p.random(sprites);
            this.size = p.random(13, 17) * scale;
            this.age = initial ? p.random(0, 0.28) : 0;
            this.speed = p.random(0.4, 1.1) * scale;
            this.angle = p.random(-0.75, 0.75);
          }
          update(dt) {
            const noise = p.noise(this.x / p.width, this.y / (14 * scale), time * 0.35);
            if (noise > 0.4) {
              this.speed = Math.min(7 * scale, this.speed + 0.22 * scale * dt);
              this.y += this.speed * dt;
            } else {
              this.x += (noise % 0.1 > 0.05 ? 0.65 : -0.65) * scale * dt;
              this.y += 0.28 * scale * dt;
              this.speed = 0;
            }
            this.age = Math.min(0.3, this.age + 0.0002 * dt);
            if (this.y > p.height + 30 || this.x < -30 || this.x > p.width + 30) {
              this.reset();
            }
          }
          draw(context, ratio = 1) {
            const size = this.size * (1 - this.age);
            const width = (this.sprite.width / 40) * size;
            const height = (this.sprite.height / 40) * size;
            context.save();
            context.translate(this.x * ratio, this.y * ratio);
            context.rotate(this.angle);
            context.drawImage(
              this.sprite,
              -width * ratio * 0.5,
              -height * ratio * 0.5,
              width * ratio,
              height * ratio,
            );
            context.restore();
          }
        }
        function makeSprites() {
          for (const word of vocabulary) {
            for (const ink of palette) {
              const sprite = document.createElement('canvas');
              sprite.width = word.length * 44 + 12;
              sprite.height = 56;
              const context = sprite.getContext('2d');
              context.font = 'bold 40px "Songti SC", "Noto Serif CJK SC", SimSun, serif';
              context.textAlign = 'center';
              context.textBaseline = 'middle';
              context.fillStyle = ink;
              context.fillText(word, sprite.width / 2, sprite.height / 2);
              sprites.push(sprite);
            }
          }
        }
        function size() {
          const width = host.clientWidth || window.innerWidth;
          const height = host.clientHeight || window.innerHeight;
          viewportWidth = width;
          viewportHeight = height;
          const resolution = Math.min(1, 1600 / width, 1000 / height);
          p.resizeCanvas(Math.round(width * resolution), Math.round(height * resolution));
          scale = resolution * Math.max(0.82, Math.min(1, width / 720));
          if (trails) trails.remove();
          trails = p.createGraphics(Math.ceil(p.width / 2), Math.ceil(p.height / 2));
          trails.pixelDensity(1);
          trails.background(0);
          particles.length = 0;
          const count = Math.round(Math.max(80, Math.min(300, (width * height) / 3400)));
          for (let i = 0; i < count; i++) particles.push(new Word());
        }
        p.syncRain = () => {
          if (!ready) return;
          host.dataset.state = enabled() ? 'running' : 'paused';
          if (enabled()) {
            if (!host.clientWidth || !host.clientHeight) return;
            if (host.clientWidth !== viewportWidth || host.clientHeight !== viewportHeight) size();
            p.loop();
          } else p.noLoop();
        };
        p.setup = () => {
          const canvas = p.createCanvas(1, 1);
          p.pixelDensity(1);
          canvas.elt.setAttribute('aria-hidden', 'true');
          p.frameRate(60);
          makeSprites();
          size();
          ready = true;
          sketch = p;
          p.syncRain();
        };
        p.draw = () => {
          if (!enabled()) {
            p.syncRain();
            return;
          }
          const dt = Math.min(2, p.deltaTime / (1000 / 60)) * 1.7;
          time += dt / 60;
          const context = trails.drawingContext;
          context.save();
          context.globalCompositeOperation = 'copy';
          context.filter = `blur(${0.7 * Math.sqrt(dt)}px)`;
          context.drawImage(trails.canvas, 0, 0);
          context.restore();
          context.fillStyle = `rgba(0, 0, 0, ${1 - Math.pow(0.96, dt)})`;
          context.fillRect(0, 0, trails.width, trails.height);
          context.globalAlpha = 0.45;
          for (const word of particles) word.draw(context, 0.5);
          context.globalAlpha = 1;
          p.background(0);
          p.image(trails, 0, 0, p.width, p.height);
          for (const word of particles) {
            word.update(dt);
            word.draw(p.drawingContext);
          }
        };
        p.windowResized = () => {
          if (enabled()) size();
        };
      }, host);
    } catch (error) {
      host.dataset.state = 'unavailable';
      console.warn('Pressure rain could not start:', error);
    } finally {
      starting = false;
    }
  }
  document.addEventListener('themechange', sync);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  sync();
})();
