(() => {
  const initialize = () => {
    const sheets = [...document.querySelectorAll('.poster-sheet')];
    const rainLayers = [...document.querySelectorAll('.poster-rain')];
    const mobile = window.matchMedia('(max-width: 768px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const stages = typeof questionStages === 'undefined' ? [] : questionStages;
    let activeSheet = null;
    let pointerFrame = 0;
    let pointerClientX = 0;
    let pointerClientY = 0;
    let activeRain = [];
    const rainColumns = new Map();
    const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));

    const createRandom = (initialSeed) => {
      let seed = initialSeed;
      return () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed / 4294967296;
      };
    };

    const populateRain = () => {
      resetPointer();
      const count = mobile.matches ? 26 : 48;
      rainLayers.forEach((layer, layerIndex) => {
        const random = createRandom(20261001 + layerIndex * 997);
        const fragment = document.createDocumentFragment();
        const columns = [];
        const stageIds = (layer.dataset.rainStages || '').split(',').map((id) => id.trim()).filter(Boolean);
        const questions = stages.filter((stage) => !stageIds.length || stageIds.includes(stage.id))
          .flatMap((stage) => stage.questions)
          .filter((question) => typeof question.zh === 'string' && typeof question.en === 'string' && question.zh && question.en);
        layer.setAttribute('aria-hidden', 'true');
        layer.style.pointerEvents = 'none';

        for (let index = 0; questions.length && index < count; index += 1) {
          const column = document.createElement('span');
          const isChinese = (index + layerIndex) % 3 !== 1;
          const targetLength = 8 + Math.floor(Math.pow(random(), 0.65) * 28);
          const question = questions[Math.floor(random() * questions.length)];
          const phrase = isChinese ? question.zh : question.en;
          const repeats = isChinese ? Math.ceil(targetLength / (Array.from(phrase).length + 1)) : 1;
          const characters = Array.from(Array(repeats).fill(phrase).join(' '));
          const length = characters.length;

          column.className = 'poster-rain-column';
          column.lang = isChinese ? 'zh-Hans' : 'en';
          column.textContent = characters.join('\n');
          const x = (index + 0.25 + random() * 0.5) / count * 100;
          const top = -8 + random() * 7;
          column.style.setProperty('--rain-x', `${x.toFixed(3)}%`);
          column.style.setProperty('--rain-top', `${top.toFixed(3)}%`);
          column.style.setProperty('--rain-length', String(length));
          column.style.setProperty('--rain-delay', `${(-random() * 18).toFixed(3)}s`);
          column.style.setProperty('--rain-duration', `${(12 + random() * 14).toFixed(3)}s`);
          column.style.setProperty('--rain-ink', index % 2 === 0 ? 'var(--poster-mint)' : 'var(--poster-pink)');
          fragment.append(column);
          columns.push({ column, x, top, length });
        }

        layer.replaceChildren(fragment);
        rainColumns.set(layer, columns);
      });
    };

    const resetPointer = () => {
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
      activeRain.forEach(({ column }) => {
        column.style.setProperty('--rain-push-x', '0px');
        column.style.setProperty('--rain-push-y', '0px');
      });
      activeRain = [];
      activeSheet = null;
    };

    const measureRain = (sheet) => {
      activeRain = [];
      sheet.querySelectorAll('.poster-rain').forEach((layer) => {
        const columns = rainColumns.get(layer) || [];
        if (!columns.length) return;
        const bounds = layer.getBoundingClientRect();
        const typography = window.getComputedStyle(columns[0].column);
        const lineHeight = Number.parseFloat(typography.lineHeight) || Number.parseFloat(typography.fontSize) * 1.2 || 14;
        const radius = clamp(bounds.width * 0.15, 110, 180);
        columns.forEach(({ column, x, top, length }, index) => {
          const start = bounds.top + bounds.height * top / 100;
          activeRain.push({
            column,
            x: bounds.left + bounds.width * x / 100,
            start,
            end: start + lineHeight * length,
            radius,
            side: index % 2 === 0 ? 1 : -1
          });
        });
      });
    };

    const updateMotion = () => {
      document.body.classList.toggle('poster-motion-paused', document.hidden || reducedMotion.matches);
      if (document.hidden || reducedMotion.matches || !finePointer.matches) resetPointer();
    };

    const paintPointer = () => {
      pointerFrame = 0;
      if (!activeSheet) return;
      activeRain.forEach(({ column, x, start, end, radius, side }) => {
        const dx = x - pointerClientX;
        const dy = clamp(pointerClientY, start, end) - pointerClientY;
        const distance = Math.hypot(dx, dy);
        const force = 24 * Math.pow(Math.max(0, 1 - distance / radius), 2);
        const pushX = (distance ? dx / distance : side) * force;
        const pushY = (distance ? dy / distance : 0) * force * 0.35;
        column.style.setProperty('--rain-push-x', `${pushX.toFixed(2)}px`);
        column.style.setProperty('--rain-push-y', `${pushY.toFixed(2)}px`);
      });
    };

    const setupConstellation = (constellation) => {
      const nodes = new Map();
      const paths = [...constellation.querySelectorAll('.poster-arcs [data-from][data-to]')];
      let drag = null;
      let dragFrame = 0;
      let resizeFrame = 0;

      constellation.querySelectorAll('.poster-node[data-node]').forEach((element) => {
        const parsedX = Number.parseFloat(element.dataset.x);
        const parsedY = Number.parseFloat(element.dataset.y);
        const x = clamp(Number.isFinite(parsedX) ? parsedX : 50, 8, 92);
        const y = clamp(Number.isFinite(parsedY) ? parsedY : 50, 15, 80);
        nodes.set(element.dataset.node, { element, x, y, homeX: x, homeY: y });
      });

      const paintConstellation = () => {
        nodes.forEach(({ element, x, y }) => {
          element.style.setProperty('--node-x', `${x.toFixed(3)}%`);
          element.style.setProperty('--node-y', `${y.toFixed(3)}%`);
        });
        paths.forEach((path) => {
          const from = nodes.get(path.dataset.from);
          const to = nodes.get(path.dataset.to);
          if (!from || !to) return;
          const parsedLift = Number.parseFloat(path.dataset.lift);
          const lift = Number.isFinite(parsedLift) ? parsedLift : 180;
          const crest = Math.min(from.y, to.y) * 10 - lift;
          path.setAttribute('d', `M ${from.x * 10} ${from.y * 10} C ${from.x * 10} ${crest} ${to.x * 10} ${crest} ${to.x * 10} ${to.y * 10}`);
        });
      };

      const positionNode = (node, x, y, bounds = constellation.getBoundingClientRect()) => {
        if (!bounds.width || !bounds.height) return;
        const label = node.element.getBoundingClientRect();
        const anchorX = bounds.left + bounds.width * node.x / 100;
        const minimumX = Math.max(8, (anchorX - label.left + 8) / bounds.width * 100);
        const maximumX = Math.min(92, 100 - (label.right - anchorX + 8) / bounds.width * 100);
        node.x = minimumX <= maximumX ? clamp(x, minimumX, maximumX) : (minimumX + maximumX) / 2;
        node.y = clamp(y, 15, 80);
      };

      const paintDrag = () => {
        dragFrame = 0;
        if (!drag) return;
        const bounds = constellation.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        positionNode(drag.node,
          (drag.clientX - bounds.left) / bounds.width * 100 + drag.offsetX,
          (drag.clientY - bounds.top) / bounds.height * 100 + drag.offsetY, bounds);
        paintConstellation();
      };

      const finishDrag = (restore = false) => {
        if (!drag) return;
        if (dragFrame) window.cancelAnimationFrame(dragFrame);
        dragFrame = 0;
        if (restore) {
          drag.node.x = drag.startX;
          drag.node.y = drag.startY;
          paintConstellation();
        } else {
          paintDrag();
        }
        const { node, pointerId } = drag;
        drag = null;
        node.element.classList.remove('is-dragging');
        constellation.classList.remove('is-dragging');
        if (node.element.hasPointerCapture(pointerId)) node.element.releasePointerCapture(pointerId);
      };

      nodes.forEach((node) => {
        const { element } = node;
        element.addEventListener('pointerdown', (event) => {
          if (event.button !== 0 || drag) return;
          const bounds = constellation.getBoundingClientRect();
          if (!bounds.width || !bounds.height) return;
          event.preventDefault();
          element.focus({ preventScroll: true });
          drag = {
            node,
            pointerId: event.pointerId,
            clientX: event.clientX,
            clientY: event.clientY,
            startX: node.x,
            startY: node.y,
            offsetX: node.x - (event.clientX - bounds.left) / bounds.width * 100,
            offsetY: node.y - (event.clientY - bounds.top) / bounds.height * 100
          };
          element.setPointerCapture(event.pointerId);
          element.classList.add('is-dragging');
          constellation.classList.add('is-dragging');
        });
        element.addEventListener('pointermove', (event) => {
          if (!drag || drag.pointerId !== event.pointerId) return;
          drag.clientX = event.clientX;
          drag.clientY = event.clientY;
          if (!dragFrame) dragFrame = window.requestAnimationFrame(paintDrag);
        });
        element.addEventListener('pointerup', (event) => {
          if (!drag || drag.pointerId !== event.pointerId) return;
          drag.clientX = event.clientX;
          drag.clientY = event.clientY;
          finishDrag();
        });
        element.addEventListener('pointercancel', (event) => {
          if (drag && drag.pointerId === event.pointerId) finishDrag(true);
        });
        element.addEventListener('lostpointercapture', (event) => {
          if (drag && drag.pointerId === event.pointerId) finishDrag(true);
        });
        element.addEventListener('keydown', (event) => {
          if (event.key === 'Escape' && drag) {
            event.preventDefault();
            finishDrag(true);
            return;
          }
          const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
          const direction = directions[event.key];
          if (!direction && event.key !== 'Home') return;
          event.preventDefault();
          finishDrag();
          if (event.key === 'Home') {
            positionNode(node, node.homeX, node.homeY);
          } else {
            const step = event.shiftKey ? 3 : 1;
            positionNode(node, node.x + direction[0] * step, node.y + direction[1] * step);
          }
          paintConstellation();
        });
      });

      const fitNodes = () => {
        resizeFrame = 0;
        finishDrag(true);
        nodes.forEach((node) => positionNode(node, node.x, node.y));
        paintConstellation();
      };

      window.addEventListener('resize', () => {
        if (!resizeFrame) resizeFrame = window.requestAnimationFrame(fitNodes);
      });
      if (document.fonts) document.fonts.ready.then(fitNodes);

      window.addEventListener('blur', () => finishDrag(true));
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) finishDrag(true);
      });
      paintConstellation();
      fitNodes();
    };

    populateRain();
    updateMotion();
    mobile.addEventListener('change', populateRain);
    reducedMotion.addEventListener('change', updateMotion);
    finePointer.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateMotion);
    window.addEventListener('resize', resetPointer);
    window.addEventListener('scroll', resetPointer, { passive: true });

    sheets.forEach((sheet) => {
      sheet.classList.add('is-ready');
      sheet.querySelectorAll('.poster-constellation').forEach(setupConstellation);
      sheet.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'mouse' || !finePointer.matches || reducedMotion.matches || document.hidden) return;
        if (!sheet.classList.contains('is-in-view')) return;
        if (activeSheet !== sheet) {
          resetPointer();
          activeSheet = sheet;
          measureRain(sheet);
        }
        pointerClientX = event.clientX;
        pointerClientY = event.clientY;
        if (!pointerFrame) pointerFrame = window.requestAnimationFrame(paintPointer);
      });
      sheet.addEventListener('pointerleave', () => {
        if (activeSheet === sheet) resetPointer();
      });
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-in-view', entry.isIntersecting);
          if (!entry.isIntersecting && activeSheet === entry.target) resetPointer();
        });
      }, { threshold: 0 });
      sheets.forEach((sheet) => observer.observe(sheet));
    } else {
      sheets.forEach((sheet) => sheet.classList.add('is-in-view'));
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
