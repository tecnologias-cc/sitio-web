(()=>{const els=document.querySelectorAll('.reveal-n');if(!('IntersectionObserver'in window)){els.forEach(x=>x.classList.add('in'));return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});els.forEach(x=>io.observe(x));})();

(()=>{
  function makeDots(container,count,onPick){if(!container)return[];container.innerHTML='';return Array.from({length:count},(_,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Ver ${i+1}`);b.addEventListener('click',()=>onPick(i));container.appendChild(b);return b})}
  const ps=document.querySelector('[data-slider="process"]');
  if(ps){const track=ps.querySelector('.process-track'),slides=[...ps.querySelectorAll('.process-slide')],dotsBox=ps.querySelector('.slider-dots');let i=0;let dots=[];const show=n=>{i=(n+slides.length)%slides.length;track.style.transform=`translateX(-${i*100}%)`;slides.forEach((s,j)=>s.classList.toggle('active',j===i));dots.forEach((d,j)=>d.classList.toggle('active',j===i))};dots=makeDots(dotsBox,slides.length,show);ps.querySelector('.prev').onclick=()=>show(i-1);ps.querySelector('.next').onclick=()=>show(i+1);show(0);let x=0;track.addEventListener('pointerdown',e=>x=e.clientX);track.addEventListener('pointerup',e=>{const dx=e.clientX-x;if(Math.abs(dx)>45)show(i+(dx<0?1:-1))})}
  const copies=[...document.querySelectorAll('.community-copy')],masters=[...document.querySelectorAll('.masters')],hotspots=[...document.querySelectorAll('.map-hotspot')],box=document.querySelector('.community-copy-slider'),dotsBox=document.querySelector('.community-dots');
  if(copies.length&&box){let i=0;let dots=[];const show=n=>{i=(n+copies.length)%copies.length;const key=copies[i].dataset.community;copies.forEach((x,j)=>x.classList.toggle('active',j===i));masters.forEach(x=>x.classList.toggle('active',x.dataset.masters===key));hotspots.forEach(x=>x.classList.toggle('active',x.dataset.target===key));dots.forEach((d,j)=>d.classList.toggle('active',j===i))};dots=makeDots(dotsBox,copies.length,show);box.querySelector('.prev').onclick=()=>show(i-1);box.querySelector('.next').onclick=()=>show(i+1);hotspots.forEach(h=>h.addEventListener('click',()=>show(copies.findIndex(c=>c.dataset.community===h.dataset.target))));let x=0;box.addEventListener('pointerdown',e=>x=e.clientX);box.addEventListener('pointerup',e=>{const dx=e.clientX-x;if(Math.abs(dx)>45)show(i+(dx<0?1:-1))});show(0)}
})();

// En pantallas táctiles, el toque reproduce el hover de las marcas de cada maestro.
(()=>{const cards=[...document.querySelectorAll('.master-card')];cards.forEach(card=>{card.tabIndex=0;card.addEventListener('click',()=>{const open=!card.classList.contains('is-open');cards.forEach(c=>c.classList.remove('is-open'));if(open)card.classList.add('is-open')})})})();


// V10 — mapa de comunidades en modal, sin ocupar espacio en el recorrido editorial.
(()=>{
 const modal=document.querySelector('#communityMapModal');
 const open=document.querySelector('.map-open');
 if(!modal||!open)return;
 const close=()=>{modal.hidden=true;document.body.classList.remove('map-opened');open.focus()};
 const show=()=>{modal.hidden=false;document.body.classList.add('map-opened');modal.querySelector('.map-close')?.focus()};
 open.addEventListener('click',show);
 modal.querySelectorAll('[data-map-close]').forEach(x=>x.addEventListener('click',close));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close()});
 modal.querySelectorAll('.map-hotspot').forEach(h=>h.addEventListener('click',()=>setTimeout(close,120)));
})();
