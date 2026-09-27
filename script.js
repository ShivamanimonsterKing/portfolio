const hero = document.querySelector('#hero');
const dev = document.querySelector('#developer');
const speech = document.querySelector('#speech');
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

function setReaction(type) {
  if (!dev || !speech) return;

  if (type === 'left') {
    dev.style.transform = 'translateX(-18px) rotate(-3deg)';
    speech.textContent = 'Anyone here on the left?';
  } else if (type === 'right') {
    dev.style.transform = 'translateX(18px) rotate(3deg)';
    speech.textContent = 'Anyone here on the right?';
  } else {
    dev.style.transform = 'translateY(-5px) scale(1.02)';
    speech.textContent = "Hey, it's you!";
  }
}

function resetReaction() {
  if (!dev || !speech) return;
  dev.style.transform = '';
  speech.textContent = window.innerWidth <= 900 ? 'Tap around — I’m here.' : 'Move around — I’m here.';
}

function handleHeroMove(clientX, clientY) {
  if (!hero || !dot) return;

  const r = hero.getBoundingClientRect();
  const x = clientX - r.left;
  const pct = r.width ? x / r.width : 0;

  if (pct < 0.34) setReaction('left');
  else if (pct > 0.66) setReaction('right');
  else setReaction('center');

  dot.style.left = clientX + 'px';
  dot.style.top = clientY + 'px';
}

if (hero) {
  hero.addEventListener('pointermove', e => handleHeroMove(e.clientX, e.clientY));
  hero.addEventListener('pointerleave', resetReaction);
  hero.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    if (touch) handleHeroMove(touch.clientX, touch.clientY);
  }, { passive: true });
}

let rx = 0, ry = 0, mx = 0, my = 0;
const canUseFinePointer = window.matchMedia('(pointer: fine)').matches;

if (canUseFinePointer) {
  document.addEventListener('pointermove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animateCursor() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    if (ring) {
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
    }
    requestAnimationFrame(animateCursor);
  }

  animateCursor();
} else {
  if (dot) dot.style.display = 'none';
  if (ring) ring.style.display = 'none';
}

const reveal = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      reveal.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.project, .skill-card, .timeline-card, .credential-main, .credential-side').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .7s ease, transform .7s ease';
  reveal.observe(el);
});
