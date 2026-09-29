import * as THREE from './assets/vendor/three/three.module.min.js';

const sheet = document.querySelector('#conversation-sheet');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
if (sheet && !motion.matches) initRain();

async function initRain() {
  await document.fonts.ready;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
  } catch (_) {
    return;
  }
  const canvas = renderer.domElement;
  canvas.className = 'interview-text-rain';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  renderer.setClearColor(0, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    -innerWidth / 2,
    innerWidth / 2,
    innerHeight / 2,
    -innerHeight / 2,
    0.1,
    20,
  );
  camera.position.z = 10;
  const active = new Map();
  let seen = new WeakSet(),
    frame = 0,
    disabled = false;
  const selector =
    '.sheet-caption, .sheet-heading h2, .sheet-heading p, .sheet-question h3, .personal-answer';
  const vertexShader = `
  attribute vec2 aTarget;
  attribute vec4 aTile;
  attribute vec3 aRain;
  uniform float uTime;
  uniform vec2 uOffset;
  uniform vec2 uCell;
  varying vec2 vUv;
  varying float vAlpha;
  void main(){
   float t=max(0.0,uTime-aRain.x);
   float gravity=520.0;
   float height=aRain.y;
   float impact=sqrt(2.0*height/gravity);
   float after=t-impact;
   float lift=max(0.0,height-.5*gravity*t*t);
   float stretch=1.0+.045*min(t/impact,1.0);
   float spread=1.0;
   if(after>=0.0){
    float reboundVelocity=.17*gravity*impact;
    float reboundTime=2.0*reboundVelocity/gravity;
    lift=max(0.0,reboundVelocity*after-.5*gravity*after*after);
    if(after>reboundTime)lift=0.0;
    stretch=1.0-.09*exp(-after*18.0)*cos(after*24.0);
    spread=1.0+.035*exp(-after*18.0);
   }
   float remaining=clamp(lift/height,0.0,1.0);
   float angle=remaining*aRain.z*.006;
   vec2 corner=position.xy*uCell*vec2(spread,stretch);
   corner=mat2(cos(angle),sin(angle),-sin(angle),cos(angle))*corner;
   vec2 xy=aTarget+uOffset+corner;
   xy.y+=lift;
   xy.x+=sin(min(t/impact,1.0)*3.14159)*aRain.z*.25;
   vUv=aTile.xy+uv*aTile.zw;
   vAlpha=smoothstep(0.0,.16,uTime-aRain.x);
   gl_Position=projectionMatrix*modelViewMatrix*vec4(xy,0.0,1.0);
  }`;
  const fragmentShader = `
  uniform sampler2D uAtlas;
  varying vec2 vUv;
  varying float vAlpha;
  void main(){
   vec4 color=texture2D(uAtlas,vUv);
   gl_FragColor=vec4(color.rgb,color.a*vAlpha);
  }`;

  function finish(element) {
    const job = active.get(element);
    if (job) {
      scene.remove(job.mesh);
      job.mesh.geometry.dispose();
      job.mesh.material.dispose();
      job.texture.dispose();
      active.delete(element);
    }
    element.classList.remove('text-rain-playing');
    element.dataset.textRain = 'settled';
  }
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    [...active.keys()].forEach(finish);
    canvas.hidden = true;
  }
  function size() {
    renderer.setSize(innerWidth, innerHeight);
    camera.left = -innerWidth / 2;
    camera.right = innerWidth / 2;
    camera.top = innerHeight / 2;
    camera.bottom = -innerHeight / 2;
    camera.updateProjectionMatrix();
  }
  function prepare(element) {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const fontSize = parseFloat(style.fontSize);
    const glyphs = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let node;
    while ((node = walker.nextNode())) {
      let offset = 0;
      for (const character of node.textContent) {
        range.setStart(node, offset);
        range.setEnd(node, offset + character.length);
        offset += character.length;
        if (/\s/.test(character)) continue;
        const box = range.getBoundingClientRect();
        if (box.width && box.height)
          glyphs.push({
            character,
            x: box.left - rect.left,
            y: box.top - rect.top,
            height: box.height,
          });
      }
    }
    if (!glyphs.length) return null;
    const characters = [...new Set(glyphs.map((g) => g.character))];
    const pad = Math.ceil(fontSize * 0.65);
    const cellWidth = Math.ceil(fontSize * 1.6 + pad * 2);
    const cellHeight = Math.ceil(Math.max(...glyphs.map((g) => g.height)) + pad * 2);
    const columns = Math.min(12, characters.length),
      rows = Math.ceil(characters.length / columns);
    const atlas = document.createElement('canvas');
    const density = 2;
    atlas.width = cellWidth * columns * density;
    atlas.height = cellHeight * rows * density;
    const ctx = atlas.getContext('2d');
    if (!ctx) return null;
    ctx.scale(density, density);
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    ctx.fillStyle = style.color;
    ctx.textBaseline = 'alphabetic';
    const metrics = ctx.measureText('Mg');
    const ascent = metrics.fontBoundingBoxAscent ?? fontSize * 0.8;
    const descent = metrics.fontBoundingBoxDescent ?? fontSize * 0.2;
    const baseline = (glyphs[0].height - ascent - descent) / 2 + ascent;
    characters.forEach((character, i) =>
      ctx.fillText(
        character,
        (i % columns) * cellWidth + pad,
        Math.floor(i / columns) * cellHeight + pad + baseline,
      ),
    );
    const texture = new THREE.CanvasTexture(atlas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    const plane = new THREE.PlaneGeometry(1, 1);
    const geometry = new THREE.InstancedBufferGeometry();
    geometry.index = plane.index;
    geometry.attributes.position = plane.attributes.position;
    geometry.attributes.uv = plane.attributes.uv;
    geometry.instanceCount = glyphs.length;
    const targets = [],
      tiles = [],
      rain = [];
    glyphs.forEach((glyph, i) => {
      const tile = characters.indexOf(glyph.character);
      targets.push(glyph.x - pad + cellWidth / 2, -glyph.y + pad - cellHeight / 2);
      tiles.push(
        (tile % columns) / columns,
        1 - (Math.floor(tile / columns) + 1) / rows,
        1 / columns,
        1 / rows,
      );
      const random = Math.abs(Math.sin((i + 1) * 78.233) * 43758.5453) % 1;
      rain.push(
        random * 0.8 + Math.min(glyph.y / Math.max(rect.height, 1), 1) * 0.45,
        85 + random * 125,
        (random - 0.5) * 22,
      );
    });
    geometry.setAttribute(
      'aTarget',
      new THREE.InstancedBufferAttribute(new Float32Array(targets), 2),
    );
    geometry.setAttribute('aTile', new THREE.InstancedBufferAttribute(new Float32Array(tiles), 4));
    geometry.setAttribute('aRain', new THREE.InstancedBufferAttribute(new Float32Array(rain), 3));
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uAtlas: { value: texture },
        uTime: { value: 0 },
        uOffset: { value: new THREE.Vector2() },
        uCell: { value: new THREE.Vector2(cellWidth, cellHeight) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    return { mesh, texture, start: performance.now() };
  }
  function draw(now) {
    frame = 0;
    if (!active.size || disabled) {
      canvas.hidden = true;
      return;
    }
    const bounds = sheet.getBoundingClientRect();
    renderer.setScissorTest(false);
    renderer.clear();
    renderer.setScissor(
      Math.max(0, bounds.left),
      Math.max(0, innerHeight - bounds.bottom),
      Math.min(innerWidth, bounds.right) - Math.max(0, bounds.left),
      Math.max(0, Math.min(innerHeight, bounds.bottom) - Math.max(0, bounds.top)),
    );
    renderer.setScissorTest(true);
    for (const [element, job] of active) {
      const elapsed = (now - job.start) / 1000;
      const rect = element.getBoundingClientRect();
      if (elapsed >= 2.75 || rect.bottom < -8 || rect.top > innerHeight + 8) {
        finish(element);
        continue;
      }
      job.mesh.material.uniforms.uTime.value = elapsed;
      job.mesh.material.uniforms.uOffset.value.set(
        rect.left - innerWidth / 2,
        innerHeight / 2 - rect.top,
      );
    }
    renderer.render(scene, camera);
    if (active.size) frame = requestAnimationFrame(draw);
    else canvas.hidden = true;
  }
  function start(element) {
    if (disabled || motion.matches || seen.has(element) || active.has(element)) return;
    seen.add(element);
    try {
      const job = prepare(element);
      if (!job) return;
      active.set(element, job);
      scene.add(job.mesh);
      element.classList.add('text-rain-playing');
      element.dataset.textRain = 'playing';
      canvas.hidden = false;
      if (!frame) frame = requestAnimationFrame(draw);
    } catch (_) {
      finish(element);
    }
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) start(entry.target);
      });
    },
    { threshold: 0.025, rootMargin: '0px 0px -9% 0px' },
  );
  const exitObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) return;
        const element = entry.target;
        if (active.has(element)) finish(element);
        seen.delete(element);
        element.dataset.textRain = 'waiting';
      });
    },
    { threshold: 0, rootMargin: '8px 0px 8px 0px' },
  );
  function disconnect() {
    observer.disconnect();
    exitObserver.disconnect();
  }
  function observe() {
    disconnect();
    sheet.querySelectorAll(selector).forEach((element) => {
      observer.observe(element);
      exitObserver.observe(element);
    });
  }
  size();
  observe();
  canvas.hidden = true;
  const changes = new MutationObserver(() => {
    stop();
    seen = new WeakSet();
    observe();
  });
  changes.observe(sheet, { childList: true, subtree: true, characterData: true });
  addEventListener('resize', () => {
    stop();
    size();
    observe();
  });
  document.addEventListener('themechange', () => {
    stop();
    seen = new WeakSet();
    observe();
  });
  motion.addEventListener('change', () => {
    if (motion.matches) {
      stop();
      disconnect();
    } else {
      seen = new WeakSet();
      observe();
    }
  });
  canvas.addEventListener('webglcontextlost', () => {
    disabled = true;
    stop();
    disconnect();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
  });
}
