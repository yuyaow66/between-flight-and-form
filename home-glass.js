document.addEventListener('DOMContentLoaded', () => {
  const content = document.querySelector('.collage-layout>.page-content');
  const layer = content?.querySelector('.home-glass');
  const columns = content?.querySelector(':scope>.columns');
  if (!layer || !columns) return;
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  layer.append(canvas);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const light = () => document.documentElement.dataset.theme !== 'dark';
  let gl,
    program,
    texture,
    uniforms,
    frame = 0,
    rebuildFrame = 0;
  let visible = false,
    ready = false,
    disposed = false,
    fontsReady = false;
  let width = 1,
    height = 1,
    time = 0,
    last = 0,
    scaleLimit = 2;
  let pointer = [-9999, -9999],
    lastMove = -10000,
    shatterAt = -10000;
  let measuredFrames = 0,
    frameCost = 0;
  const source = document.createElement('canvas');
  const ctx = source.getContext('2d');
  const vertex = `
    attribute vec2 position;
    varying vec2 uv;
    void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}
   `;
  const fragment = `
    precision highp float;
    uniform sampler2D ink;
    uniform vec2 size;
    uniform vec2 pointer;
    uniform vec4 title;
    uniform float time;
    uniform float touch;
    uniform float shatter;
    varying vec2 uv;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){
     vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
     return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);
    }
    float fbm(vec2 p){
     float v=0.,a=.5;
     for(int i=0;i<4;i++){v+=a*noise(p);p=mat2(.8,-.6,.6,.8)*p*2.03+3.7;a*=.5;}
     return v;
    }
    float fold(vec2 p){return sin(p.x*.85+p.y*.37+fbm(p*.64+time*.022)*12.);}
    vec4 sampleInk(vec2 p){return texture2D(ink,vec2(p.x/size.x,1.-p.y/size.y));}
    void main(){
     vec2 pos=vec2(uv.x,1.-uv.y)*size;
     float inTitle=step(title.x-20.,pos.x)*step(pos.x,title.z+20.)*step(title.y-20.,pos.y)*step(pos.y,title.w+20.);
     float weight=mix(.10,1.,inTitle);
     vec2 q=pos/92.;
     float n=fbm(q+vec2(time*.018,-time*.013));
     float crease=fold(q);
     vec2 gradient=vec2(fold(q+vec2(.025,0.))-fold(q-vec2(.025,0.)),fold(q+vec2(0.,.025))-fold(q-vec2(0.,.025)))/.05;
     float distanceToMouse=length(pos-pointer);
     float disk=1.-smoothstep(18.,155.,distanceToMouse);
     float wave=sin(distanceToMouse*.055-time*2.4)*disk*touch;
     float pressure=1.+disk*touch*2.8+shatter*7.;
     vec2 fluid=vec2(n-.48,fbm(q+9.4-time*.01)-.48)*11.;
     vec2 offset=(fluid+gradient*2.1)*pressure*weight;
     offset+=normalize(pos-pointer+vec2(.01))*wave*11.*weight;
     vec2 at=pos+offset;
     vec4 sharp=sampleInk(at);
     float pocket=smoothstep(.51,.73,fbm(q*.8+vec2(18.,time*.026)));
     float radius=(.4+pocket*3.7+disk*touch*3.+shatter*2.)*weight;
     vec2 dx=vec2(radius,0.),dy=vec2(0.,radius);
     vec4 blurred=sharp*.25;
     blurred+=(sampleInk(at+dx)+sampleInk(at-dx)+sampleInk(at+dy)+sampleInk(at-dy))*.125;
     blurred+=(sampleInk(at+dx+dy)+sampleInk(at-dx+dy)+sampleInk(at+dx-dy)+sampleInk(at-dx-dy))*.0625;
     vec4 pigment=mix(sharp,blurred,clamp(.15+pocket*.8+disk*touch*.35,0.,.95)*weight);
     float grain=hash(floor(pos*1.7));
     float threshold=.22+(grain-.5)*.22*weight;
     float alpha=mix(pigment.a,smoothstep(threshold-.13,threshold+.17,pigment.a),.84*weight);
     float edge=abs(sampleInk(at+normalize(gradient+vec2(.001))*.85).a-sharp.a);
     float rim=pow(1.-abs(crease),14.)*clamp(length(gradient)*.17,0.,1.);
     vec3 color=pigment.rgb/max(pigment.a,.001);
     color=mix(color,vec3(.98),clamp(pocket*.40+rim*.70+edge*.44,0.,.82)*weight);
     color+=(grain-.5)*.09*weight;
     alpha*=(1.-smoothstep(.90,1.,grain)*.20*weight)*inTitle;
     gl_FragColor=vec4(clamp(color,0.,1.)*alpha,alpha);
    }
   `;
  function fallback() {
    disposed = true;
    cancelAnimationFrame(frame);
    frame = 0;
    content.classList.remove('glass-rendered');
    content.classList.add('glass-fallback');
    layer.dataset.renderer = 'svg';
    canvas.hidden = true;
  }
  function compile(type, code) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  }
  try {
    gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    });
    if (!gl || !ctx) throw new Error('WebGL unavailable');
    const vs = compile(gl.VERTEX_SHADER, vertex),
      fs = compile(gl.FRAGMENT_SHADER, fragment);
    program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const attribute = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    uniforms = Object.fromEntries(
      ['ink', 'size', 'pointer', 'title', 'time', 'touch', 'shatter'].map((name) => [
        name,
        gl.getUniformLocation(program, name),
      ]),
    );
    gl.uniform1i(uniforms.ink, 0);
  } catch (error) {
    fallback();
    return;
  }
  function rebuild() {
    rebuildFrame = 0;
    if (disposed || !fontsReady || !light()) return;
    const origin = content.getBoundingClientRect();
    width = origin.width;
    height = origin.height;
    if (!width || !height) return;
    const ratio = Math.min(
      devicePixelRatio || 1,
      scaleLimit,
      1800 / Math.max(width, height),
      Math.sqrt(1250000 / (width * height)),
    );
    source.width = canvas.width = Math.ceil(width * ratio);
    source.height = canvas.height = Math.ceil(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.textBaseline = 'alphabetic';
    const walker = document.createTreeWalker(columns, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let node;
    while ((node = walker.nextNode())) {
      if (!node.textContent.trim()) continue;
      const style = getComputedStyle(node.parentElement);
      if (style.display === 'none' || style.visibility === 'hidden') continue;
      const fontSize = parseFloat(style.fontSize);
      ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      ctx.fillStyle = style.color;
      ctx.fontKerning = 'normal';
      let offset = 0;
      for (const character of node.textContent) {
        range.setStart(node, offset);
        offset += character.length;
        range.setEnd(node, offset);
        if (!character.trim()) continue;
        const rect = range.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        const glyph = style.textTransform === 'uppercase' ? character.toUpperCase() : character;
        const metrics = ctx.measureText(glyph);
        const ascent = metrics.fontBoundingBoxAscent ?? fontSize * 0.8;
        const descent = metrics.fontBoundingBoxDescent ?? fontSize * 0.2;
        const baseline = rect.top - origin.top + (rect.height - ascent - descent) / 2 + ascent;
        ctx.fillText(glyph, rect.left - origin.left, baseline);
        if (style.textDecorationLine.includes('underline'))
          ctx.fillRect(
            rect.left - origin.left,
            baseline + 2,
            rect.width,
            Math.max(0.6, fontSize / 24),
          );
      }
    }
    const titleRange = document.createRange();
    titleRange.selectNodeContents(columns.querySelector('.webtitle'));
    const title = titleRange.getBoundingClientRect();
    gl.useProgram(program);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uniforms.size, width, height);
    gl.uniform4f(
      uniforms.title,
      title.left - origin.left,
      title.top - origin.top,
      title.right - origin.left,
      title.bottom - origin.top,
    );
    ready = true;
    draw(performance.now());
    content.classList.add('glass-rendered');
    layer.dataset.renderer = 'webgl';
    schedule();
  }
  function draw(now) {
    if (!ready || disposed) return;
    const dt = last ? Math.min(0.06, (now - last) / 1000) : 0;
    last = now;
    if (!reduced.matches) time += dt;
    gl.useProgram(program);
    gl.uniform1f(uniforms.time, reduced.matches ? 2 : time);
    gl.uniform2f(uniforms.pointer, pointer[0], pointer[1]);
    gl.uniform1f(uniforms.touch, reduced.matches ? 0 : Math.max(0, 1 - (now - lastMove) / 1000));
    gl.uniform1f(
      uniforms.shatter,
      reduced.matches ? 0 : Math.pow(Math.max(0, 1 - (now - shatterAt) / 900), 2),
    );
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  function tick(now) {
    frame = 0;
    if (!light() || !visible || document.hidden || disposed) {
      last = 0;
      return;
    }
    if (last && !reduced.matches) {
      frameCost += Math.min(60, now - last);
      measuredFrames++;
      if (measuredFrames === 120) {
        if (frameCost / measuredFrames > 23 && scaleLimit > 0.85) {
          scaleLimit = Math.max(0.85, scaleLimit * 0.8);
          queueRebuild();
        }
        measuredFrames = 0;
        frameCost = 0;
      }
    }
    draw(now);
    if (!reduced.matches) frame = requestAnimationFrame(tick);
  }
  function schedule() {
    if (!frame && ready && light() && visible && !document.hidden && !disposed)
      frame = requestAnimationFrame(tick);
  }
  function queueRebuild() {
    if (!rebuildFrame) rebuildFrame = requestAnimationFrame(rebuild);
  }
  content.addEventListener(
    'pointermove',
    (event) => {
      if (!light() || reduced.matches) return;
      const rect = content.getBoundingClientRect();
      pointer = [event.clientX - rect.left, event.clientY - rect.top];
      lastMove = performance.now();
      schedule();
    },
    { passive: true },
  );
  content.addEventListener(
    'pointerleave',
    () => {
      lastMove = performance.now();
    },
    { passive: true },
  );
  content.addEventListener('click', (event) => {
    if (event.target.closest('a,button,input,select,textarea') || reduced.matches || !light())
      return;
    const rect = content.getBoundingClientRect();
    pointer = [event.clientX - rect.left, event.clientY - rect.top];
    shatterAt = performance.now();
    lastMove = shatterAt;
    schedule();
  });
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    fallback();
  });
  new ResizeObserver(queueRebuild).observe(content);
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) schedule();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    }
  }).observe(content);
  document.fonts.ready.then(() => {
    fontsReady = true;
    queueRebuild();
  });
  document.fonts.addEventListener('loadingdone', queueRebuild);
  document.addEventListener('themechange', () => {
    last = 0;
    if (light()) queueRebuild();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  document.addEventListener('visibilitychange', () => {
    last = 0;
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else schedule();
  });
  reduced.addEventListener('change', () => {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    draw(performance.now());
    schedule();
  });
  addEventListener('resize', queueRebuild);
});
