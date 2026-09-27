const hero = document.querySelector('#hero');
const dev = document.querySelector('#developer');
const speech = document.querySelector('#speech');
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

function setReaction(type){
  if(type === 'left'){
    dev.style.transform = 'translateX(-18px) rotate(-3deg)';
    speech.textContent = 'Anyone here on the left?';
  } else if(type === 'right'){
    dev.style.transform = 'translateX(18px) rotate(3deg)';
    speech.textContent = 'Anyone here on the right?';
  } else {
    dev.style.transform = 'translateY(-5px) scale(1.02)';
    speech.textContent = 'Hey, it’s you!';
  }
}
function resetReaction(){
  dev.style.transform = '';
  speech.textContent = 'Move around — I’m here.';
}
hero.addEventListener('mousemove', e => {
  const r = hero.getBoundingClientRect();
  const x = e.clientX - r.left;
  const pct = x / r.width;
  if(pct < .34) setReaction('left');
  else if(pct > .66) setReaction('right');
  else setReaction('center');
  dot.style.left = e.clientX+'px'; dot.style.top = e.clientY+'px';
});
hero.addEventListener('mouseleave', resetReaction);

let rx=0, ry=0, mx=0, my=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
function animateCursor(){
  rx += (mx-rx)*.15; ry += (my-ry)*.15;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(animateCursor);
}
if(window.matchMedia('(min-width:900px)').matches) animateCursor();

const reveal = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.style.opacity='1'; entry.target.style.transform='translateY(0)'; reveal.unobserve(entry.target); }
  });
},{threshold:.08});
document.querySelectorAll('.project,.skill-card,.timeline-card,.credential-main,.credential-side').forEach(el=>{
  el.style.opacity='0'; el.style.transform='translateY(20px)'; el.style.transition='opacity .7s ease, transform .7s ease';
  reveal.observe(el);
});
